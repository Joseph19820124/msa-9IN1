package com.fooddelivery.notification.repository;

import com.fooddelivery.notification.model.Notification;
import com.fooddelivery.notification.model.NotificationStatus;
import com.fooddelivery.notification.model.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByCustomerId(String customerId);
    List<Notification> findByOrderId(String orderId);
    List<Notification> findByStatus(NotificationStatus status);
    List<Notification> findByType(NotificationType type);
    List<Notification> findByRecipient(String recipient);
}