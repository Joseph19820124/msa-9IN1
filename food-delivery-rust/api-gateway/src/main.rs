use axum::{
    routing::{get, post, put, delete},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod handlers;
mod service_discovery;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "api_gateway=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Initialize service discovery
    let discovery = service_discovery::ServiceDiscovery::new("http://consul:8500")
        .await
        .expect("Failed to connect to Consul");

    // Build our application with routes
    let app = Router::new()
        // Order service routes
        .route("/api/orders", post(handlers::create_order))
        .route("/api/orders/:id", get(handlers::get_order))
        .route("/api/orders/:id/status", put(handlers::update_order_status))
        .route("/api/orders/customer/:customer_id", get(handlers::get_customer_orders))
        
        // Restaurant service routes
        .route("/api/restaurants", post(handlers::create_restaurant))
        .route("/api/restaurants", get(handlers::get_restaurants))
        .route("/api/restaurants/:id", get(handlers::get_restaurant))
        .route("/api/restaurants/:id/menu", get(handlers::get_menu))
        .route("/api/restaurants/:id/menu", post(handlers::add_menu_item))
        
        // Kitchen service routes
        .route("/api/kitchen/orders/:order_id", get(handlers::get_kitchen_order))
        .route("/api/kitchen/orders/:order_id/status", put(handlers::update_kitchen_status))
        
        // Delivery service routes
        .route("/api/deliveries/order/:order_id", get(handlers::get_delivery))
        .route("/api/deliveries/:id/assign", put(handlers::assign_driver))
        .route("/api/deliveries/:id/status", put(handlers::update_delivery_status))
        
        // Accounting service routes
        .route("/api/transactions", post(handlers::create_transaction))
        .route("/api/transactions/order/:order_id", get(handlers::get_order_transactions))
        
        // Notification service routes
        .route("/api/notifications", post(handlers::send_notification))
        .route("/api/notifications/user/:user_id", get(handlers::get_user_notifications))
        
        // Health check
        .route("/health", get(|| async { "OK" }))
        
        .layer(CorsLayer::permissive())
        .with_state(discovery);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("API Gateway listening on {}", addr);
    
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}