use sqlx::PgPool;
use uuid::Uuid;
use shared::{AppError, Result};

use crate::models::KitchenOrderEntity;

pub async fn create_kitchen_order(
    pool: &PgPool,
    order_id: Uuid,
    restaurant_id: Uuid,
    estimated_time: i32,
) -> Result<KitchenOrderEntity> {
    let order = sqlx::query_as!(
        KitchenOrderEntity,
        r#"
        INSERT INTO kitchen_orders (order_id, restaurant_id, status, estimated_time)
        VALUES ($1, $2, $3, $4)
        RETURNING id, order_id, restaurant_id, status, estimated_time, created_at
        "#,
        order_id,
        restaurant_id,
        "RECEIVED",
        estimated_time
    )
    .fetch_one(pool)
    .await?;
    
    Ok(order)
}

pub async fn get_kitchen_order_by_order_id(pool: &PgPool, order_id: Uuid) -> Result<KitchenOrderEntity> {
    let order = sqlx::query_as!(
        KitchenOrderEntity,
        r#"
        SELECT id, order_id, restaurant_id, status, estimated_time, created_at
        FROM kitchen_orders
        WHERE order_id = $1
        "#,
        order_id
    )
    .fetch_optional(pool)
    .await?
    .ok_or(AppError::NotFound)?;
    
    Ok(order)
}

pub async fn update_kitchen_order_status(
    pool: &PgPool,
    order_id: Uuid,
    status: &str,
) -> Result<KitchenOrderEntity> {
    let order = sqlx::query_as!(
        KitchenOrderEntity,
        r#"
        UPDATE kitchen_orders
        SET status = $2
        WHERE order_id = $1
        RETURNING id, order_id, restaurant_id, status, estimated_time, created_at
        "#,
        order_id,
        status
    )
    .fetch_optional(pool)
    .await?
    .ok_or(AppError::NotFound)?;
    
    Ok(order)
}

pub async fn get_restaurant_orders(pool: &PgPool, restaurant_id: Uuid) -> Result<Vec<KitchenOrderEntity>> {
    let orders = sqlx::query_as!(
        KitchenOrderEntity,
        r#"
        SELECT id, order_id, restaurant_id, status, estimated_time, created_at
        FROM kitchen_orders
        WHERE restaurant_id = $1
        ORDER BY created_at DESC
        "#,
        restaurant_id
    )
    .fetch_all(pool)
    .await?;
    
    Ok(orders)
}