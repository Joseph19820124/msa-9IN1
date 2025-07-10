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

use crate::{database, models::CreateKitchenOrderRequest};

pub async fn create_kitchen_order(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateKitchenOrderRequest>,
) -> Result<impl IntoResponse> {
    let kitchen_order_entity = database::create_kitchen_order(
        &pool,
        payload.order_id,
        payload.restaurant_id,
        payload.estimated_time,
    ).await?;
    
    let kitchen_order: KitchenOrder = kitchen_order_entity.into();
    
    Ok((StatusCode::CREATED, Json(kitchen_order)))
}

pub async fn get_kitchen_order(
    State(pool): State<PgPool>,
    Path(order_id): Path<Uuid>,
) -> Result<impl IntoResponse> {
    let kitchen_order_entity = database::get_kitchen_order_by_order_id(&pool, order_id).await?;
    let kitchen_order: KitchenOrder = kitchen_order_entity.into();
    
    Ok(Json(kitchen_order))
}

pub async fn update_kitchen_status(
    State(pool): State<PgPool>,
    Path(order_id): Path<Uuid>,
    Json(payload): Json<UpdateKitchenStatusRequest>,
) -> Result<impl IntoResponse> {
    let status_str = format!("{:?}", payload.status).to_uppercase();
    let kitchen_order_entity = database::update_kitchen_order_status(&pool, order_id, &status_str).await?;
    let kitchen_order: KitchenOrder = kitchen_order_entity.into();
    
    // Notify order service about status change
    tokio::spawn(async move {
        match payload.status {
            KitchenStatus::Preparing => {
                let _ = update_order_status(order_id, OrderStatus::Preparing).await;
            }
            KitchenStatus::Ready => {
                let _ = update_order_status(order_id, OrderStatus::Ready).await;
            }
            _ => {}
        }
    });
    
    Ok(Json(kitchen_order))
}

pub async fn get_restaurant_orders(
    State(pool): State<PgPool>,
    Path(restaurant_id): Path<Uuid>,
) -> Result<impl IntoResponse> {
    let kitchen_order_entities = database::get_restaurant_orders(&pool, restaurant_id).await?;
    let kitchen_orders: Vec<KitchenOrder> = kitchen_order_entities
        .into_iter()
        .map(Into::into)
        .collect();
    
    Ok(Json(kitchen_orders))
}

// Helper function to notify order service
async fn update_order_status(order_id: Uuid, status: OrderStatus) -> Result<()> {
    let client = reqwest::Client::new();
    let _ = client.put(format!("http://order-service:8080/orders/{}/status", order_id))
        .json(&UpdateOrderStatusRequest { status })
        .send()
        .await;
    
    Ok(())
}