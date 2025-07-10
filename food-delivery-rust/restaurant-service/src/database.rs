use sqlx::PgPool;
use uuid::Uuid;
use shared::{AppError, Result};

use crate::models::{RestaurantEntity, MenuItemEntity};

pub async fn create_restaurant(
    pool: &PgPool,
    name: &str,
    cuisine_type: &str,
    address: &str,
    phone: &str,
) -> Result<RestaurantEntity> {
    let restaurant = sqlx::query_as!(
        RestaurantEntity,
        r#"
        INSERT INTO restaurants (name, cuisine_type, address, phone)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, cuisine_type, address, phone, is_active, created_at
        "#,
        name,
        cuisine_type,
        address,
        phone
    )
    .fetch_one(pool)
    .await?;
    
    Ok(restaurant)
}

pub async fn get_restaurant_by_id(pool: &PgPool, id: Uuid) -> Result<RestaurantEntity> {
    let restaurant = sqlx::query_as!(
        RestaurantEntity,
        r#"
        SELECT id, name, cuisine_type, address, phone, is_active, created_at
        FROM restaurants
        WHERE id = $1
        "#,
        id
    )
    .fetch_optional(pool)
    .await?
    .ok_or(AppError::NotFound)?;
    
    Ok(restaurant)
}

pub async fn get_all_restaurants(pool: &PgPool) -> Result<Vec<RestaurantEntity>> {
    let restaurants = sqlx::query_as!(
        RestaurantEntity,
        r#"
        SELECT id, name, cuisine_type, address, phone, is_active, created_at
        FROM restaurants
        WHERE is_active = true
        ORDER BY name
        "#
    )
    .fetch_all(pool)
    .await?;
    
    Ok(restaurants)
}

pub async fn create_menu_item(
    pool: &PgPool,
    restaurant_id: Uuid,
    name: &str,
    description: &str,
    price: f64,
    category: &str,
) -> Result<MenuItemEntity> {
    let item = sqlx::query_as!(
        MenuItemEntity,
        r#"
        INSERT INTO menu_items (restaurant_id, name, description, price, category)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, restaurant_id, name, description, price, category, is_available
        "#,
        restaurant_id,
        name,
        description,
        price,
        category
    )
    .fetch_one(pool)
    .await?;
    
    Ok(item)
}

pub async fn get_menu_items(pool: &PgPool, restaurant_id: Uuid) -> Result<Vec<MenuItemEntity>> {
    let items = sqlx::query_as!(
        MenuItemEntity,
        r#"
        SELECT id, restaurant_id, name, description, price, category, is_available
        FROM menu_items
        WHERE restaurant_id = $1 AND is_available = true
        ORDER BY category, name
        "#,
        restaurant_id
    )
    .fetch_all(pool)
    .await?;
    
    Ok(items)
}