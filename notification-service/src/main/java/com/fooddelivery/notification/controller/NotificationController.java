package com.fooddelivery.notification.controller;

import com.fooddelivery.notification.model.Notification;
import com.fooddelivery.notification.model.NotificationStatus;
import com.fooddelivery.notification.model.NotificationType;
import com.fooddelivery.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @PostMapping("/sms")
    public ResponseEntity<Notification> sendSMS(@RequestBody SMSRequest request) {
        try {
            Notification notification = notificationService.sendSMS(
                request.getPhoneNumber(), 
                request.getContent(),
                request.getOrderId(),
                request.getCustomerId()
            );
            return new ResponseEntity<>(notification, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/email")
    public ResponseEntity<Notification> sendEmail(@RequestBody EmailRequest request) {
        try {
            Notification notification = notificationService.sendEmail(
                request.getEmail(),
                request.getSubject(),
                request.getContent(),
                request.isHtml(),
                request.getOrderId(),
                request.getCustomerId()
            );
            return new ResponseEntity<>(notification, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/order")
    public ResponseEntity<Void> sendOrderNotification(@RequestBody OrderNotificationRequest request) {
        try {
            notificationService.sendOrderNotification(
                request.getOrderId(),
                request.getCustomerId(),
                request.getRecipient(),
                request.getOrderStatus(),
                request.getType()
            );
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{notificationId}")
    public ResponseEntity<Notification> getNotification(@PathVariable Long notificationId) {
        Optional<Notification> notification = notificationService.getNotificationById(notificationId);
        return notification.map(n -> ResponseEntity.ok(n))
                          .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Notification>> getNotificationsByCustomer(@PathVariable String customerId) {
        List<Notification> notifications = notificationService.getNotificationsByCustomer(customerId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Notification>> getNotificationsByOrder(@PathVariable String orderId) {
        List<Notification> notifications = notificationService.getNotificationsByOrder(orderId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Notification>> getNotificationsByStatus(@PathVariable NotificationStatus status) {
        List<Notification> notifications = notificationService.getNotificationsByStatus(status);
        return ResponseEntity.ok(notifications);
    }
    
    @PostMapping("/retry-failed")
    public ResponseEntity<Void> retryFailedNotifications() {
        notificationService.retryFailedNotifications();
        return ResponseEntity.ok().build();
    }
    
    // DTO类
    static class SMSRequest {
        private String phoneNumber;
        private String content;
        private String orderId;
        private String customerId;
        
        // Getters and Setters
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        
        public String getCustomerId() { return customerId; }
        public void setCustomerId(String customerId) { this.customerId = customerId; }
    }
    
    static class EmailRequest {
        private String email;
        private String subject;
        private String content;
        private boolean html;
        private String orderId;
        private String customerId;
        
        // Getters and Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        
        public boolean isHtml() { return html; }
        public void setHtml(boolean html) { this.html = html; }
        
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        
        public String getCustomerId() { return customerId; }
        public void setCustomerId(String customerId) { this.customerId = customerId; }
    }
    
    static class OrderNotificationRequest {
        private String orderId;
        private String customerId;
        private String recipient;
        private String orderStatus;
        private NotificationType type;
        
        // Getters and Setters
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        
        public String getCustomerId() { return customerId; }
        public void setCustomerId(String customerId) { this.customerId = customerId; }
        
        public String getRecipient() { return recipient; }
        public void setRecipient(String recipient) { this.recipient = recipient; }
        
        public String getOrderStatus() { return orderStatus; }
        public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
        
        public NotificationType getType() { return type; }
        public void setType(NotificationType type) { this.type = type; }
    }
}