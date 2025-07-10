package com.fooddelivery.accounting.service;

import com.fooddelivery.accounting.adapter.StripeAdapter;
import com.fooddelivery.accounting.model.Payment;
import com.fooddelivery.accounting.model.PaymentStatus;
import com.fooddelivery.accounting.repository.PaymentRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AccountingService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private StripeAdapter stripeAdapter;
    
    public Payment createPayment(Payment payment) throws StripeException {
        // 验证支付信息
        validatePayment(payment);
        
        // 创建 Stripe PaymentIntent
        PaymentIntent paymentIntent = stripeAdapter.createPaymentIntent(
            payment.getCustomerId(),
            payment.getAmount(),
            payment.getCurrency(),
            payment.getOrderId()
        );
        
        // 更新支付记录
        payment.setStripePaymentIntentId(paymentIntent.getId());
        payment.setStatus(PaymentStatus.PROCESSING);
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // TODO: 发送支付创建事件
        // publishPaymentCreatedEvent(savedPayment);
        
        return savedPayment;
    }
    
    public Payment confirmPayment(String paymentId) throws StripeException {
        Optional<Payment> paymentOpt = paymentRepository.findById(Long.valueOf(paymentId));
        if (!paymentOpt.isPresent()) {
            throw new RuntimeException("Payment not found: " + paymentId);
        }
        
        Payment payment = paymentOpt.get();
        
        // 确认 Stripe 支付
        PaymentIntent paymentIntent = stripeAdapter.confirmPaymentIntent(payment.getStripePaymentIntentId());
        
        // 更新支付状态
        if ("succeeded".equals(paymentIntent.getStatus())) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setProcessedAt(LocalDateTime.now());
            
            if (paymentIntent.getCharges() != null && !paymentIntent.getCharges().getData().isEmpty()) {
                payment.setStripeChargeId(paymentIntent.getCharges().getData().get(0).getId());
            }
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }
        
        Payment updatedPayment = paymentRepository.save(payment);
        
        // TODO: 发送支付确认事件
        // publishPaymentConfirmedEvent(updatedPayment);
        
        return updatedPayment;
    }
    
    public Payment refundPayment(String paymentId, BigDecimal refundAmount) throws StripeException {
        Optional<Payment> paymentOpt = paymentRepository.findById(Long.valueOf(paymentId));
        if (!paymentOpt.isPresent()) {
            throw new RuntimeException("Payment not found: " + paymentId);
        }
        
        Payment payment = paymentOpt.get();
        
        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Payment is not in completed status");
        }
        
        // 创建 Stripe 退款
        Refund refund = stripeAdapter.createRefund(
            payment.getStripeChargeId(),
            refundAmount,
            payment.getCurrency()
        );
        
        // 更新支付状态
        payment.setStatus(PaymentStatus.REFUNDED);
        Payment updatedPayment = paymentRepository.save(payment);
        
        // TODO: 发送退款事件
        // publishPaymentRefundedEvent(updatedPayment, refundAmount);
        
        return updatedPayment;
    }
    
    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }
    
    public Optional<Payment> getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId);
    }
    
    public List<Payment> getPaymentsByCustomer(String customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }
    
    private void validatePayment(Payment payment) {
        if (payment.getOrderId() == null || payment.getOrderId().isEmpty()) {
            throw new IllegalArgumentException("Order ID is required");
        }
        if (payment.getCustomerId() == null || payment.getCustomerId().isEmpty()) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        if (payment.getAmount() == null || payment.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
    }
}