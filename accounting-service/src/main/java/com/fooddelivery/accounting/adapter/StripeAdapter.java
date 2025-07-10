package com.fooddelivery.accounting.adapter;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Component
public class StripeAdapter {
    
    @Value("${stripe.secret-key}")
    private String stripeSecretKey;
    
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }
    
    public PaymentIntent createPaymentIntent(String customerId, BigDecimal amount, String currency, String orderId) 
            throws StripeException {
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount.multiply(BigDecimal.valueOf(100)).longValue()) // 转换为分
                .setCurrency(currency.toLowerCase())
                .setCustomer(customerId)
                .putMetadata("orderId", orderId)
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();
        
        return PaymentIntent.create(params);
    }
    
    public PaymentIntent confirmPaymentIntent(String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent.confirm();
    }
    
    public PaymentIntent retrievePaymentIntent(String paymentIntentId) throws StripeException {
        return PaymentIntent.retrieve(paymentIntentId);
    }
    
    public Refund createRefund(String chargeId, BigDecimal amount, String currency) throws StripeException {
        RefundCreateParams params = RefundCreateParams.builder()
                .setCharge(chargeId)
                .setAmount(amount.multiply(BigDecimal.valueOf(100)).longValue()) // 转换为分
                .build();
        
        return Refund.create(params);
    }
    
    public boolean validateWebhookSignature(String payload, String sigHeader, String webhookSecret) {
        try {
            com.stripe.net.Webhook.constructEvent(payload, sigHeader, webhookSecret);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}