use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use sqlx::PgPool;
use uuid::Uuid;
use shared::*;
use reqwest;

use crate::database;

pub async fn create_order(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateOrderRequest>,
) -> Result<impl IntoResponse> {
    // Calculate total amount (in real app, would fetch from restaurant service)
    let total_amount = payload.items.iter()
        .map(|item| item.quantity as f64 * 10.0) // Placeholder price
        .sum();
    
    // Create order
    let order_entity = database::create_order(
        &pool,
        payload.customer_id,
        payload.restaurant_id,
        total_amount,
        &payload.delivery_address,
    ).await?;
    
    // Create order items
    for item in &payload.items {
        database::create_order_item(
            &pool,
            order_entity.id,
            item.menu_item_id,
            "Item", // In real app, would fetch from restaurant service
            item.quantity,
            10.0, // Placeholder price
        ).await?;
    }
    
    // Fetch complete order with items
    let items = database::get_order_items(&pool, order_entity.id).await?;
    let order = order_entity.to_order(items);
    
    // Notify other services asynchronously
    tokio::spawn(async move {
        // Notify kitchen service
        let _ = notify_kitchen_service(order.id, order.restaurant_id).await;
        
        // Notify delivery service
        let _ = notify_delivery_service(order.id).await;
        
        // Notify accounting service
        let _ = notify_accounting_service(order.id, order.total_amount).await;
    });
    
    Ok((StatusCode::CREATED, Json(order)))
}

pub async fn get_order(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse> {
    let order_entity = database::get_order_by_id(&pool, id).await?;
    let items = database::get_order_items(&pool, id).await?;
    let order = order_entity.to_order(items);
    
    Ok(Json(order))
}

pub async fn update_order_status(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateOrderStatusRequest>,
) -> Result<impl IntoResponse> {
    let status_str = format!("{:?}", payload.status).to_uppercase();
    let order_entity = database::update_order_status(&pool, id, &status_str).await?;
    let items = database::get_order_items(&pool, id).await?;
    let order = order_entity.to_order(items);
    
    // Notify services based on status change
    tokio::spawn(async move {
        match payload.status {
            OrderStatus::Confirmed => {
                let _ = notify_notification_service(
                    order.customer_id,
                    "Order Confirmed",
                    "Your order has been confirmed by the restaurant",
                ).await;
            }
            OrderStatus::Ready => {
                let _ = notify_notification_service(
                    order.customer_id,
                    "Order Ready",
                    "Your order is ready for pickup",
                ).await;
            }
            OrderStatus::Delivered => {
                let _ = notify_notification_service(
                    order.customer_id,
                    "Order Delivered",
                    "Your order has been delivered successfully",
                ).await;
            }
            _ => {}
        }
    });
    
    Ok(Json(order))
}

pub async fn get_customer_orders(
    State(pool): State<PgPool>,
    Path(customer_id): Path<Uuid>,
) -> Result<impl IntoResponse> {
    let order_entities = database::get_customer_orders(&pool, customer_id).await?;
    
    let mut orders = Vec::new();
    for entity in order_entities {
        let items = database::get_order_items(&pool, entity.id).await?;
        orders.push(entity.to_order(items));
    }
    
    Ok(Json(orders))
}

// Helper functions to notify other services
async fn notify_kitchen_service(order_id: Uuid, restaurant_id: Uuid) -> Result<()> {
    let client = reqwest::Client::new();
    let _ = client.post("http://kitchen-service:8080/kitchen/orders")
        .json(&serde_json::json!({
            "orderId": order_id,
            "restaurantId": restaurant_id,
            "estimatedTime": 30
        }))
        .send()
        .await;
    
    Ok(())
}

async fn notify_delivery_service(order_id: Uuid) -> Result<()> {
    let client = reqwest::Client::new();
    let _ = client.post("http://delivery-service:8080/deliveries")
        .json(&serde_json::json!({
            "orderId": order_id
        }))
        .send()
        .await;
    
    Ok(())
}

async fn notify_accounting_service(order_id: Uuid, amount: f64) -> Result<()> {
    let client = reqwest::Client::new();
    let _ = client.post("http://accounting-service:8080/transactions")
        .json(&serde_json::json!({
            "orderId": order_id,
            "amount": amount,
            "transactionType": "PAYMENT"
        }))
        .send()
        .await;
    
    Ok(())
}

async fn notify_notification_service(user_id: Uuid, title: &str, message: &str) -> Result<()> {
    let client = reqwest::Client::new();
    let _ = client.post("http://notification-service:8080/notifications")
        .json(&CreateNotificationRequest {
            user_id,
            notification_type: NotificationType::GeneralUpdate,
            title: title.to_string(),
            message: message.to_string(),
        })
        .send()
        .await;
    
    Ok(())
}