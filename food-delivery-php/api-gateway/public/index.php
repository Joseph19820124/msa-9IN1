<?php
use Slim\Factory\AppFactory;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$app = AppFactory::create();

// CORS middleware
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

// Service URLs
$services = [
    'order' => $_ENV['ORDER_SERVICE_URL'] ?? 'http://order-service:3001',
    'restaurant' => $_ENV['RESTAURANT_SERVICE_URL'] ?? 'http://restaurant-service:3002',
    'kitchen' => $_ENV['KITCHEN_SERVICE_URL'] ?? 'http://kitchen-service:3003',
    'delivery' => $_ENV['DELIVERY_SERVICE_URL'] ?? 'http://delivery-service:3004',
    'accounting' => $_ENV['ACCOUNTING_SERVICE_URL'] ?? 'http://accounting-service:3005',
    'notification' => $_ENV['NOTIFICATION_SERVICE_URL'] ?? 'http://notification-service:3006'
];

$client = new Client(['timeout' => 30]);

// Helper function for service calls
function callService($client, $services, $service, $method, $path, $data = null) {
    try {
        $url = $services[$service] . $path;
        $options = [
            'headers' => ['Content-Type' => 'application/json']
        ];
        
        if ($data) {
            $options['json'] = $data;
        }
        
        $response = $client->request($method, $url, $options);
        return [
            'status' => $response->getStatusCode(),
            'data' => json_decode($response->getBody(), true)
        ];
    } catch (RequestException $e) {
        $statusCode = $e->hasResponse() ? $e->getResponse()->getStatusCode() : 503;
        $message = $e->hasResponse() ? 
            json_decode($e->getResponse()->getBody(), true) : 
            ['error' => 'Service unavailable: ' . $e->getMessage()];
        
        return [
            'status' => $statusCode,
            'data' => $message
        ];
    }
}

// Health check
$app->get('/health', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode(['status' => 'healthy', 'service' => 'api-gateway']));
    return $response->withHeader('Content-Type', 'application/json');
});

// Order endpoints
$app->get('/api/orders', function (Request $request, Response $response) use ($client, $services) {
    $result = callService($client, $services, 'order', 'GET', '/orders');
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->get('/api/orders/{id}', function (Request $request, Response $response, $args) use ($client, $services) {
    $result = callService($client, $services, 'order', 'GET', '/orders/' . $args['id']);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->post('/api/orders', function (Request $request, Response $response) use ($client, $services) {
    $data = json_decode($request->getBody(), true);
    $result = callService($client, $services, 'order', 'POST', '/orders', $data);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->put('/api/orders/{id}', function (Request $request, Response $response, $args) use ($client, $services) {
    $data = json_decode($request->getBody(), true);
    $result = callService($client, $services, 'order', 'PUT', '/orders/' . $args['id'], $data);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

// Restaurant endpoints
$app->get('/api/restaurants', function (Request $request, Response $response) use ($client, $services) {
    $result = callService($client, $services, 'restaurant', 'GET', '/restaurants');
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->get('/api/restaurants/{id}', function (Request $request, Response $response, $args) use ($client, $services) {
    $result = callService($client, $services, 'restaurant', 'GET', '/restaurants/' . $args['id']);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->post('/api/restaurants', function (Request $request, Response $response) use ($client, $services) {
    $data = json_decode($request->getBody(), true);
    $result = callService($client, $services, 'restaurant', 'POST', '/restaurants', $data);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

// Menu endpoints
$app->get('/api/restaurants/{id}/menu', function (Request $request, Response $response, $args) use ($client, $services) {
    $result = callService($client, $services, 'restaurant', 'GET', '/restaurants/' . $args['id'] . '/menu');
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->post('/api/restaurants/{id}/menu', function (Request $request, Response $response, $args) use ($client, $services) {
    $data = json_decode($request->getBody(), true);
    $result = callService($client, $services, 'restaurant', 'POST', '/restaurants/' . $args['id'] . '/menu', $data);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

// Kitchen endpoints
$app->get('/api/kitchen/orders', function (Request $request, Response $response) use ($client, $services) {
    $result = callService($client, $services, 'kitchen', 'GET', '/kitchen/orders');
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->put('/api/kitchen/orders/{id}', function (Request $request, Response $response, $args) use ($client, $services) {
    $data = json_decode($request->getBody(), true);
    $result = callService($client, $services, 'kitchen', 'PUT', '/kitchen/orders/' . $args['id'], $data);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

// Delivery endpoints
$app->get('/api/deliveries', function (Request $request, Response $response) use ($client, $services) {
    $result = callService($client, $services, 'delivery', 'GET', '/deliveries');
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->get('/api/deliveries/{id}', function (Request $request, Response $response, $args) use ($client, $services) {
    $result = callService($client, $services, 'delivery', 'GET', '/deliveries/' . $args['id']);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->put('/api/deliveries/{id}', function (Request $request, Response $response, $args) use ($client, $services) {
    $data = json_decode($request->getBody(), true);
    $result = callService($client, $services, 'delivery', 'PUT', '/deliveries/' . $args['id'], $data);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

// Accounting endpoints
$app->get('/api/payments', function (Request $request, Response $response) use ($client, $services) {
    $result = callService($client, $services, 'accounting', 'GET', '/payments');
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->post('/api/payments', function (Request $request, Response $response) use ($client, $services) {
    $data = json_decode($request->getBody(), true);
    $result = callService($client, $services, 'accounting', 'POST', '/payments', $data);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

// Notification endpoints
$app->post('/api/notifications', function (Request $request, Response $response) use ($client, $services) {
    $data = json_decode($request->getBody(), true);
    $result = callService($client, $services, 'notification', 'POST', '/notifications', $data);
    $response->getBody()->write(json_encode($result['data']));
    return $response->withStatus($result['status'])->withHeader('Content-Type', 'application/json');
});

$app->run();