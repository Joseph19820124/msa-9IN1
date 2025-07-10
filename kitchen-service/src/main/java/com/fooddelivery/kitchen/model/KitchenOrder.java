package com.fooddelivery.kitchen.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "kitchen_orders")
public class KitchenOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String orderId;
    
    @Column(nullable = false)
    private String restaurantId;
    
    @Enumerated(EnumType.STRING)
    private KitchenOrderStatus status;
    
    @Column(nullable = false)
    private LocalDateTime receivedAt;
    
    private LocalDateTime startedAt;
    
    private LocalDateTime completedAt;
    
    private Integer estimatedPrepTime; // 预计制作时间(分钟)
    
    private Integer actualPrepTime; // 实际制作时间(分钟)
    
    private String assignedChef;
    
    private String notes;
    
    @ElementCollection
    @CollectionTable(name = "kitchen_order_items", joinColumns = @JoinColumn(name = "kitchen_order_id"))
    private List<KitchenOrderItem> items;
    
    // 构造函数
    public KitchenOrder() {
        this.receivedAt = LocalDateTime.now();
        this.status = KitchenOrderStatus.RECEIVED;
        this.estimatedPrepTime = 20; // 默认配置
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    
    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }
    
    public KitchenOrderStatus getStatus() { return status; }
    public void setStatus(KitchenOrderStatus status) { this.status = status; }
    
    public LocalDateTime getReceivedAt() { return receivedAt; }
    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public Integer getEstimatedPrepTime() { return estimatedPrepTime; }
    public void setEstimatedPrepTime(Integer estimatedPrepTime) { this.estimatedPrepTime = estimatedPrepTime; }
    
    public Integer getActualPrepTime() { return actualPrepTime; }
    public void setActualPrepTime(Integer actualPrepTime) { this.actualPrepTime = actualPrepTime; }
    
    public String getAssignedChef() { return assignedChef; }
    public void setAssignedChef(String assignedChef) { this.assignedChef = assignedChef; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public List<KitchenOrderItem> getItems() { return items; }
    public void setItems(List<KitchenOrderItem> items) { this.items = items; }
}

@Embeddable
class KitchenOrderItem {
    private String itemName;
    private Integer quantity;
    private String specialInstructions;
    
    // Getters and Setters
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
}

enum KitchenOrderStatus {
    RECEIVED, IN_PROGRESS, COMPLETED, CANCELLED
}