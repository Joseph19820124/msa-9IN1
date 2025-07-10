use sqlx::{PgPool, postgres::PgQueryResult};
use uuid::Uuid;
use chrono::Utc;
use shared::{AppError, Result};

use crate::models::{OrderEntity, OrderItemEntity};

pub async fn create_order(
    pool: &PgPool,
    customer_id: Uuid,
    restaurant_id: Uuid,
    total_amount: f64,
    delivery_address: &str,
) -> Result<OrderEntity> {
    let order = sqlx::query_as!(
        OrderEntity,
        r#"
        INSERT INTO orders (customer_id, restaurant_id, status, total_amount, delivery_address)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, customer_id, restaurant_id, status, total_amount, delivery_address, created_at, updated_at
        "#,
        customer_id,
        restaurant_id,
        "PENDING",
        total_amount,
        delivery_address
    )
    .fetch_one(pool)
    .await?;
    
    Ok(order)
}

pub async fn create_order_item(
    pool: &PgPool,
    order_id: Uuid,
    menu_item_id: Uuid,
    name: &str,
    quantity: i32,
    price: f64,
) -> Result<OrderItemEntity> {
    let item = sqlx::query_as!(
        OrderItemEntity,
        r#"
        INSERT INTO order_items (order_id, menu_item_id, name, quantity, price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, order_id, menu_item_id, name, quantity, price
        "#,
        order_id,
        menu_item_id,
        name,
        quantity,
        price
    )
    .fetch_one(pool)
    .await?;
    
    Ok(item)
}

pub async fn get_order_by_id(pool: &PgPool, id: Uuid) -> Result<OrderEntity> {
    let order = sqlx::query_as!(
        OrderEntity,
        r#"
        SELECT id, customer_id, restaurant_id, status, total_amount, delivery_address, created_at, updated_at
        FROM orders
        WHERE id = $1
        "#,
        id
    )
    .fetch_optional(pool)
    .await?
    .ok_or(AppError::NotFound)?;
    
    Ok(order)
}

pub async fn get_order_items(pool: &PgPool, order_id: Uuid) -> Result<Vec<OrderItemEntity>> {
    let items = sqlx::query_as!(
        OrderItemEntity,
        r#"
        SELECT id, order_id, menu_item_id, name, quantity, price
        FROM order_items
        WHERE order_id = $1
        "#,
        order_id
    )
    .fetch_all(pool)
    .await?;
    
    Ok(items)
}

pub async fn update_order_status(pool: &PgPool, id: Uuid, status: &str) -> Result<OrderEntity> {
    let order = sqlx::query_as!(
        OrderEntity,
        r#"
        UPDATE orders
        SET status = $2, updated_at = $3
        WHERE id = $1
        RETURNING id, customer_id, restaurant_id, status, total_amount, delivery_address, created_at, updated_at
        "#,
        id,
        status,
        Utc::now()
    )
    .fetch_optional(pool)
    .await?
    .ok_or(AppError::NotFound)?;
    
    Ok(order)
}

pub async fn get_customer_orders(pool: &PgPool, customer_id: Uuid) -> Result<Vec<OrderEntity>> {
    let orders = sqlx::query_as!(
        OrderEntity,
        r#"
        SELECT id, customer_id, restaurant_id, status, total_amount, delivery_address, created_at, updated_at
        FROM orders
        WHERE customer_id = $1
        ORDER BY created_at DESC
        "#,
        customer_id
    )
    .fetch_all(pool)
    .await?;
    
    Ok(orders)
}