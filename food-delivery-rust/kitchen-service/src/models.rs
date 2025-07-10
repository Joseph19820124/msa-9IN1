use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct KitchenOrderEntity {
    pub id: Uuid,
    pub order_id: Uuid,
    pub restaurant_id: Uuid,
    pub status: String,
    pub estimated_time: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateKitchenOrderRequest {
    pub order_id: Uuid,
    pub restaurant_id: Uuid,
    pub estimated_time: i32,
}

impl From<KitchenOrderEntity> for shared::KitchenOrder {
    fn from(entity: KitchenOrderEntity) -> Self {
        shared::KitchenOrder {
            id: entity.id,
            order_id: entity.order_id,
            restaurant_id: entity.restaurant_id,
            status: entity.status.parse().unwrap_or(shared::KitchenStatus::Received),
            estimated_time: entity.estimated_time,
            created_at: entity.created_at,
        }
    }
}