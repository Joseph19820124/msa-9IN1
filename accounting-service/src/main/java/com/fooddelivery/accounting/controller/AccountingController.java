package com.fooddelivery.accounting.controller;

import com.fooddelivery.accounting.model.Payment;
import com.fooddelivery.accounting.service.AccountingService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounting")
@CrossOrigin(origins = "*")
public class AccountingController {
    
    @Autowired
    private AccountingService accountingService;
    
    @PostMapping("/payments")
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        try {
            Payment createdPayment = accountingService.createPayment(payment);
            return new ResponseEntity<>(createdPayment, HttpStatus.CREATED);
        } catch (StripeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/payments/{paymentId}/confirm")
    public ResponseEntity<Payment> confirmPayment(@PathVariable String paymentId) {
        try {
            Payment confirmedPayment = accountingService.confirmPayment(paymentId);
            return ResponseEntity.ok(confirmedPayment);
        } catch (StripeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/payments/{paymentId}/refund")
    public ResponseEntity<Payment> refundPayment(
            @PathVariable String paymentId,
            @RequestParam BigDecimal amount) {
        try {
            Payment refundedPayment = accountingService.refundPayment(paymentId, amount);
            return ResponseEntity.ok(refundedPayment);
        } catch (StripeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/payments/{paymentId}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long paymentId) {
        Optional<Payment> payment = accountingService.getPaymentById(paymentId);
        return payment.map(p -> ResponseEntity.ok(p))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/payments/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrder(@PathVariable String orderId) {
        Optional<Payment> payment = accountingService.getPaymentByOrderId(orderId);
        return payment.map(p -> ResponseEntity.ok(p))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/payments/customer/{customerId}")
    public ResponseEntity<List<Payment>> getPaymentsByCustomer(@PathVariable String customerId) {
        List<Payment> payments = accountingService.getPaymentsByCustomer(customerId);
        return ResponseEntity.ok(payments);
    }
}