use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct OrderEntity {
    pub id: Uuid,
    pub customer_id: Uuid,
    pub restaurant_id: Uuid,
    pub status: String,
    pub total_amount: f64,
    pub delivery_address: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct OrderItemEntity {
    pub id: Uuid,
    pub order_id: Uuid,
    pub menu_item_id: Uuid,
    pub name: String,
    pub quantity: i32,
    pub price: f64,
}

impl OrderEntity {
    pub fn to_order(&self, items: Vec<OrderItemEntity>) -> shared::Order {
        shared::Order {
            id: self.id,
            customer_id: self.customer_id,
            restaurant_id: self.restaurant_id,
            items: items.into_iter().map(|item| shared::OrderItem {
                menu_item_id: item.menu_item_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            }).collect(),
            status: self.status.parse().unwrap_or(shared::OrderStatus::Pending),
            total_amount: self.total_amount,
            delivery_address: self.delivery_address.clone(),
            created_at: self.created_at,
            updated_at: self.updated_at,
        }
    }
}