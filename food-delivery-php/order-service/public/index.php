<?php
use Slim\Factory\AppFactory;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Illuminate\Database\Capsule\Manager as Capsule;
use GuzzleHttp\Client;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Database setup
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'pgsql',
    'host' => $_ENV['DB_HOST'] ?? 'postgres-orders',
    'port' => $_ENV['DB_PORT'] ?? 5432,
    'database' => $_ENV['DB_DATABASE'] ?? 'food_delivery_orders_php',
    'username' => $_ENV['DB_USERNAME'] ?? 'postgres',
    'password' => $_ENV['DB_PASSWORD'] ?? 'password',
    'charset' => 'utf8',
    'prefix' => '',
    'schema' => 'public',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

// Order model
class Order extends \Illuminate\Database\Eloquent\Model
{
    protected $fillable = ['customer_id', 'restaurant_id', 'items', 'total_amount', 'status'];
    protected $casts = [
        'items' => 'array',
        'total_amount' => 'decimal:2'
    ];
}

$app = AppFactory::create();

// CORS middleware
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$client = new Client(['timeout' => 5]);

// Helper function to notify other services
function notifyService($client, $event, $data) {
    $notificationUrl = $_ENV['NOTIFICATION_SERVICE_URL'] ?? 'http://notification-service';
    
    try {
        $client->post("$notificationUrl/notifications", [
            'json' => [
                'type' => $event,
                'data' => $data
            ]
        ]);
    } catch (Exception $e) {
        error_log("Failed to send notification: " . $e->getMessage());
    }
}

// Health check
$app->get('/health', function (Request $request, Response $response) {
    try {
        Capsule::select('SELECT 1');
        $response->getBody()->write(json_encode(['status' => 'healthy', 'service' => 'order-service']));
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(['status' => 'unhealthy', 'error' => $e->getMessage()]));
        $response = $response->withStatus(503);
    }
    return $response->withHeader('Content-Type', 'application/json');
});

// Get all orders
$app->get('/orders', function (Request $request, Response $response) {
    try {
        $orders = Order::all();
        $response->getBody()->write($orders->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
    }
});

// Get order by ID
$app->get('/orders/{id}', function (Request $request, Response $response, $args) {
    try {
        $order = Order::findOrFail($args['id']);
        $response->getBody()->write($order->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(['error' => 'Order not found']));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }
});

// Create new order
$app->post('/orders', function (Request $request, Response $response) use ($client) {
    try {
        $data = json_decode($request->getBody(), true);
        
        // Validation
        $required = ['customer_id', 'restaurant_id', 'items', 'total_amount'];
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                $response->getBody()->write(json_encode(['error' => "Missing required field: $field"]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
        }
        
        $order = Order::create([
            'customer_id' => $data['customer_id'],
            'restaurant_id' => $data['restaurant_id'],
            'items' => $data['items'],
            'total_amount' => $data['total_amount'],
            'status' => 'pending'
        ]);
        
        // Notify other services
        notifyService($client, 'order_created', $order->toArray());
        
        $response->getBody()->write($order->toJson());
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }
});

// Update order
$app->put('/orders/{id}', function (Request $request, Response $response, $args) use ($client) {
    try {
        $order = Order::findOrFail($args['id']);
        $data = json_decode($request->getBody(), true);
        
        $allowedFields = ['status', 'total_amount', 'items'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));
        
        $order->update($updateData);
        
        // Notify other services about status change
        if (isset($data['status'])) {
            notifyService($client, 'order_updated', $order->toArray());
        }
        
        $response->getBody()->write($order->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(['error' => 'Order not found']));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }
});

// Delete order
$app->delete('/orders/{id}', function (Request $request, Response $response, $args) use ($client) {
    try {
        $order = Order::findOrFail($args['id']);
        $order->delete();
        
        notifyService($client, 'order_deleted', ['id' => $args['id']]);
        
        return $response->withStatus(204);
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(['error' => 'Order not found']));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }
});

$app->run();