package com.fooddelivery.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // 订单服务路由
                .route("order-service", r -> r.path("/api/orders/**")
                        .uri("lb://order-service"))
                
                // 餐厅服务路由
                .route("restaurant-service", r -> r.path("/api/restaurants/**")
                        .uri("lb://restaurant-service"))
                
                // 厨房服务路由
                .route("kitchen-service", r -> r.path("/api/kitchen/**")
                        .uri("lb://kitchen-service"))
                
                // 配送服务路由
                .route("delivery-service", r -> r.path("/api/delivery/**")
                        .uri("lb://delivery-service"))
                
                // 会计服务路由
                .route("accounting-service", r -> r.path("/api/accounting/**")
                        .uri("lb://accounting-service"))
                
                // 通知服务路由
                .route("notification-service", r -> r.path("/api/notifications/**")
                        .uri("lb://notification-service"))
                
                .build();
    }
}