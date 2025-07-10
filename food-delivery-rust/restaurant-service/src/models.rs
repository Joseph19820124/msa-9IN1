use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct RestaurantEntity {
    pub id: Uuid,
    pub name: String,
    pub cuisine_type: String,
    pub address: String,
    pub phone: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct MenuItemEntity {
    pub id: Uuid,
    pub restaurant_id: Uuid,
    pub name: String,
    pub description: String,
    pub price: f64,
    pub category: String,
    pub is_available: bool,
}

impl From<RestaurantEntity> for shared::Restaurant {
    fn from(entity: RestaurantEntity) -> Self {
        shared::Restaurant {
            id: entity.id,
            name: entity.name,
            cuisine_type: entity.cuisine_type,
            address: entity.address,
            phone: entity.phone,
            is_active: entity.is_active,
            created_at: entity.created_at,
        }
    }
}

impl From<MenuItemEntity> for shared::MenuItem {
    fn from(entity: MenuItemEntity) -> Self {
        shared::MenuItem {
            id: entity.id,
            restaurant_id: entity.restaurant_id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            category: entity.category,
            is_available: entity.is_available,
        }
    }
}