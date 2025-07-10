use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use shared::*;
use uuid::Uuid;

use crate::service_discovery::ServiceDiscovery;

// Order service handlers
pub async fn create_order(
    State(discovery): State<ServiceDiscovery>,
    Json(payload): Json<CreateOrderRequest>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("order-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.post(format!("{}/orders", url))
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn get_order(
    State(discovery): State<ServiceDiscovery>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("order-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.get(format!("{}/orders/{}", url, id))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn update_order_status(
    State(discovery): State<ServiceDiscovery>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateOrderStatusRequest>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("order-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.put(format!("{}/orders/{}/status", url, id))
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn get_customer_orders(
    State(discovery): State<ServiceDiscovery>,
    Path(customer_id): Path<Uuid>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("order-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.get(format!("{}/orders/customer/{}", url, customer_id))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

// Restaurant service handlers
pub async fn create_restaurant(
    State(discovery): State<ServiceDiscovery>,
    Json(payload): Json<CreateRestaurantRequest>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("restaurant-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.post(format!("{}/restaurants", url))
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn get_restaurants(
    State(discovery): State<ServiceDiscovery>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("restaurant-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.get(format!("{}/restaurants", url))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn get_restaurant(
    State(discovery): State<ServiceDiscovery>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("restaurant-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.get(format!("{}/restaurants/{}", url, id))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn get_menu(
    State(discovery): State<ServiceDiscovery>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("restaurant-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.get(format!("{}/restaurants/{}/menu", url, id))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn add_menu_item(
    State(discovery): State<ServiceDiscovery>,
    Path(id): Path<Uuid>,
    Json(payload): Json<CreateMenuItemRequest>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("restaurant-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.post(format!("{}/restaurants/{}/menu", url, id))
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

// Kitchen service handlers
pub async fn get_kitchen_order(
    State(discovery): State<ServiceDiscovery>,
    Path(order_id): Path<Uuid>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("kitchen-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.get(format!("{}/kitchen/orders/{}", url, order_id))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn update_kitchen_status(
    State(discovery): State<ServiceDiscovery>,
    Path(order_id): Path<Uuid>,
    Json(payload): Json<UpdateKitchenStatusRequest>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("kitchen-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.put(format!("{}/kitchen/orders/{}/status", url, order_id))
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

// Delivery service handlers
pub async fn get_delivery(
    State(discovery): State<ServiceDiscovery>,
    Path(order_id): Path<Uuid>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("delivery-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.get(format!("{}/deliveries/order/{}", url, order_id))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn assign_driver(
    State(discovery): State<ServiceDiscovery>,
    Path(id): Path<Uuid>,
    Json(payload): Json<AssignDriverRequest>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("delivery-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.put(format!("{}/deliveries/{}/assign", url, id))
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn update_delivery_status(
    State(discovery): State<ServiceDiscovery>,
    Path(id): Path<Uuid>,
    Json(payload): Json<serde_json::Value>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("delivery-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.put(format!("{}/deliveries/{}/status", url, id))
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

// Accounting service handlers
pub async fn create_transaction(
    State(discovery): State<ServiceDiscovery>,
    Json(payload): Json<serde_json::Value>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("accounting-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.post(format!("{}/transactions", url))
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn get_order_transactions(
    State(discovery): State<ServiceDiscovery>,
    Path(order_id): Path<Uuid>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("accounting-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.get(format!("{}/transactions/order/{}", url, order_id))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

// Notification service handlers
pub async fn send_notification(
    State(discovery): State<ServiceDiscovery>,
    Json(payload): Json<CreateNotificationRequest>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("notification-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.post(format!("{}/notifications", url))
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}

pub async fn get_user_notifications(
    State(discovery): State<ServiceDiscovery>,
    Path(user_id): Path<Uuid>,
) -> impl IntoResponse {
    let url = match discovery.get_service_url("notification-service").await {
        Ok(url) => url,
        Err(_) => return (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    };
    
    let client = reqwest::Client::new();
    match client.get(format!("{}/notifications/user/{}", url, user_id))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::SERVICE_UNAVAILABLE, "Service unavailable").into_response(),
    }
}