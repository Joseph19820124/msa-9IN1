package com.fooddelivery.notification.adapter;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class TwilioAdapter {
    
    @Value("${twilio.account-sid}")
    private String accountSid;
    
    @Value("${twilio.auth-token}")
    private String authToken;
    
    @Value("${twilio.from-phone}")
    private String fromPhone;
    
    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }
    
    public String sendSMS(String toPhone, String messageContent) {
        try {
            Message message = Message.creator(
                new PhoneNumber(toPhone),
                new PhoneNumber(fromPhone),
                messageContent
            ).create();
            
            return message.getSid();
        } catch (Exception e) {
            throw new RuntimeException("Failed to send SMS: " + e.getMessage(), e);
        }
    }
    
    public Message.Status getMessageStatus(String messageSid) {
        try {
            Message message = Message.fetcher(messageSid).fetch();
            return message.getStatus();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch message status: " + e.getMessage(), e);
        }
    }
    
    public boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber != null && 
               phoneNumber.matches("^\\+[1-9]\\d{1,14}$"); // E.164格式验证
    }
}