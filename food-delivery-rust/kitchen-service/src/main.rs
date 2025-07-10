use axum::{
    routing::{get, post, put},
    Router,
};
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod handlers;
mod database;
mod models;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "kitchen_service=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Database connection
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@kitchen-db:5432/kitchendb".to_string());
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    // Build our application with routes
    let app = Router::new()
        .route("/kitchen/orders", post(handlers::create_kitchen_order))
        .route("/kitchen/orders/:order_id", get(handlers::get_kitchen_order))
        .route("/kitchen/orders/:order_id/status", put(handlers::update_kitchen_status))
        .route("/kitchen/restaurant/:restaurant_id", get(handlers::get_restaurant_orders))
        .route("/health", get(|| async { "OK" }))
        .layer(CorsLayer::permissive())
        .with_state(pool);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("Kitchen service listening on {}", addr);
    
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}