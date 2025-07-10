package com.fooddelivery.notification.service;

import com.fooddelivery.notification.adapter.SESAdapter;
import com.fooddelivery.notification.adapter.TwilioAdapter;
import com.fooddelivery.notification.model.Notification;
import com.fooddelivery.notification.model.NotificationStatus;
import com.fooddelivery.notification.model.NotificationType;
import com.fooddelivery.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private TwilioAdapter twilioAdapter;
    
    @Autowired
    private SESAdapter sesAdapter;
    
    public Notification sendSMS(String phoneNumber, String content) {
        return sendSMS(phoneNumber, content, null, null);
    }
    
    public Notification sendSMS(String phoneNumber, String content, String orderId, String customerId) {
        // 验证手机号码
        if (!twilioAdapter.isValidPhoneNumber(phoneNumber)) {
            throw new IllegalArgumentException("Invalid phone number format");
        }
        
        // 创建通知记录
        Notification notification = new Notification(phoneNumber, content, NotificationType.SMS);
        notification.setOrderId(orderId);
        notification.setCustomerId(customerId);
        
        try {
            // 发送SMS
            String messageSid = twilioAdapter.sendSMS(phoneNumber, content);
            
            // 更新通知状态
            notification.setExternalId(messageSid);
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            
        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(e.getMessage());
        }
        
        return notificationRepository.save(notification);
    }
    
    public Notification sendEmail(String email, String subject, String content) {
        return sendEmail(email, subject, content, false, null, null);
    }
    
    public Notification sendEmail(String email, String subject, String content, boolean isHtml, 
                                 String orderId, String customerId) {
        // 验证邮箱地址
        if (!sesAdapter.isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email address format");
        }
        
        // 创建通知记录
        Notification notification = new Notification(email, content, NotificationType.EMAIL);
        notification.setOrderId(orderId);
        notification.setCustomerId(customerId);
        
        try {
            // 发送邮件
            String messageId = sesAdapter.sendEmail(email, subject, content, isHtml);
            
            // 更新通知状态
            notification.setExternalId(messageId);
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            
        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(e.getMessage());
        }
        
        return notificationRepository.save(notification);
    }
    
    public void sendOrderNotification(String orderId, String customerId, String recipient, 
                                    String orderStatus, NotificationType type) {
        String content = generateOrderNotificationContent(orderId, orderStatus);
        
        switch (type) {
            case SMS:
                sendSMS(recipient, content, orderId, customerId);
                break;
            case EMAIL:
                String subject = "订单状态更新 - " + orderId;
                sendEmail(recipient, subject, content, false, orderId, customerId);
                break;
            default:
                throw new IllegalArgumentException("Unsupported notification type: " + type);
        }
    }
    
    public Optional<Notification> getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId);
    }
    
    public List<Notification> getNotificationsByCustomer(String customerId) {
        return notificationRepository.findByCustomerId(customerId);
    }
    
    public List<Notification> getNotificationsByOrder(String orderId) {
        return notificationRepository.findByOrderId(orderId);
    }
    
    public List<Notification> getNotificationsByStatus(NotificationStatus status) {
        return notificationRepository.findByStatus(status);
    }
    
    public void retryFailedNotifications() {
        List<Notification> failedNotifications = notificationRepository.findByStatus(NotificationStatus.FAILED);
        
        for (Notification notification : failedNotifications) {
            try {
                switch (notification.getType()) {
                    case SMS:
                        String messageSid = twilioAdapter.sendSMS(notification.getRecipient(), 
                                                                notification.getContent());
                        notification.setExternalId(messageSid);
                        break;
                    case EMAIL:
                        String[] parts = notification.getContent().split("\n", 2);
                        String subject = parts.length > 1 ? parts[0] : "通知";
                        String content = parts.length > 1 ? parts[1] : notification.getContent();
                        
                        String messageId = sesAdapter.sendEmail(notification.getRecipient(), 
                                                              subject, content);
                        notification.setExternalId(messageId);
                        break;
                }
                
                notification.setStatus(NotificationStatus.SENT);
                notification.setSentAt(LocalDateTime.now());
                notification.setErrorMessage(null);
                
            } catch (Exception e) {
                notification.setErrorMessage(e.getMessage());
            }
            
            notificationRepository.save(notification);
        }
    }
    
    private String generateOrderNotificationContent(String orderId, String orderStatus) {
        switch (orderStatus.toLowerCase()) {
            case "confirmed":
                return "您的订单 " + orderId + " 已确认，餐厅正在准备中。";
            case "preparing":
                return "您的订单 " + orderId + " 正在制作中，预计15-20分钟完成。";
            case "ready_for_pickup":
                return "您的订单 " + orderId + " 已准备就绪，配送员即将取餐。";
            case "out_for_delivery":
                return "您的订单 " + orderId + " 正在配送中，预计10-15分钟送达。";
            case "delivered":
                return "您的订单 " + orderId + " 已送达，感谢您的选择！";
            case "cancelled":
                return "很抱歉，您的订单 " + orderId + " 已取消。";
            default:
                return "您的订单 " + orderId + " 状态已更新为：" + orderStatus;
        }
    }
}