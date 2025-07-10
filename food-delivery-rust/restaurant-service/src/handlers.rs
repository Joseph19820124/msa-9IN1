use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use sqlx::PgPool;
use uuid::Uuid;
use shared::*;

use crate::database;

pub async fn create_restaurant(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateRestaurantRequest>,
) -> Result<impl IntoResponse> {
    let restaurant_entity = database::create_restaurant(
        &pool,
        &payload.name,
        &payload.cuisine_type,
        &payload.address,
        &payload.phone,
    ).await?;
    
    let restaurant: Restaurant = restaurant_entity.into();
    
    Ok((StatusCode::CREATED, Json(restaurant)))
}

pub async fn get_restaurants(
    State(pool): State<PgPool>,
) -> Result<impl IntoResponse> {
    let restaurant_entities = database::get_all_restaurants(&pool).await?;
    let restaurants: Vec<Restaurant> = restaurant_entities
        .into_iter()
        .map(Into::into)
        .collect();
    
    Ok(Json(restaurants))
}

pub async fn get_restaurant(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse> {
    let restaurant_entity = database::get_restaurant_by_id(&pool, id).await?;
    let restaurant: Restaurant = restaurant_entity.into();
    
    Ok(Json(restaurant))
}

pub async fn get_menu(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse> {
    // Verify restaurant exists
    let _ = database::get_restaurant_by_id(&pool, id).await?;
    
    let menu_entities = database::get_menu_items(&pool, id).await?;
    let menu_items: Vec<MenuItem> = menu_entities
        .into_iter()
        .map(Into::into)
        .collect();
    
    Ok(Json(menu_items))
}

pub async fn add_menu_item(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    Json(payload): Json<CreateMenuItemRequest>,
) -> Result<impl IntoResponse> {
    // Verify restaurant exists
    let _ = database::get_restaurant_by_id(&pool, id).await?;
    
    let menu_entity = database::create_menu_item(
        &pool,
        id,
        &payload.name,
        &payload.description,
        payload.price,
        &payload.category,
    ).await?;
    
    let menu_item: MenuItem = menu_entity.into();
    
    Ok((StatusCode::CREATED, Json(menu_item)))
}