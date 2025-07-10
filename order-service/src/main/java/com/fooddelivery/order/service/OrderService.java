package com.fooddelivery.order.service;

import com.fooddelivery.order.model.Order;
import com.fooddelivery.order.model.OrderStatus;
import com.fooddelivery.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    public Order createOrder(Order order) {
        // 业务逻辑：验证订单数据
        validateOrder(order);
        
        // 保存订单
        Order savedOrder = orderRepository.save(order);
        
        // TODO: 发送事件通知其他服务
        // publishOrderCreatedEvent(savedOrder);
        
        return savedOrder;
    }
    
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }
    
    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
    
    public List<Order> getOrdersByRestaurant(String restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }
    
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(status);
            
            Order updatedOrder = orderRepository.save(order);
            
            // TODO: 发送状态更新事件
            // publishOrderStatusUpdatedEvent(updatedOrder);
            
            return updatedOrder;
        }
        throw new RuntimeException("Order not found: " + orderId);
    }
    
    public void cancelOrder(Long orderId) {
        updateOrderStatus(orderId, OrderStatus.CANCELLED);
    }
    
    private void validateOrder(Order order) {
        if (order.getCustomerId() == null || order.getCustomerId().isEmpty()) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        if (order.getRestaurantId() == null || order.getRestaurantId().isEmpty()) {
            throw new IllegalArgumentException("Restaurant ID is required");
        }
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order items are required");
        }
        if (order.getTotalAmount() == null || order.getTotalAmount().signum() <= 0) {
            throw new IllegalArgumentException("Total amount must be positive");
        }
    }
}