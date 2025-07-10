package com.fooddelivery.notification.adapter;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.simpleemail.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.regex.Pattern;

@Component
public class SESAdapter {
    
    @Value("${aws.access-key}")
    private String accessKey;
    
    @Value("${aws.secret-key}")
    private String secretKey;
    
    @Value("${aws.region}")
    private String region;
    
    @Value("${aws.ses.from-email}")
    private String fromEmail;
    
    private AmazonSimpleEmailService sesClient;
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    
    @PostConstruct
    public void init() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
        
        this.sesClient = AmazonSimpleEmailServiceClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .withRegion(Regions.fromName(region))
                .build();
    }
    
    public String sendEmail(String toEmail, String subject, String content) {
        return sendEmail(toEmail, subject, content, false);
    }
    
    public String sendEmail(String toEmail, String subject, String content, boolean isHtml) {
        try {
            SendEmailRequest request = new SendEmailRequest()
                .withDestination(new Destination().withToAddresses(toEmail))
                .withMessage(new Message()
                    .withBody(new Body()
                        .withText(isHtml ? null : new Content().withCharset("UTF-8").withData(content))
                        .withHtml(isHtml ? new Content().withCharset("UTF-8").withData(content) : null))
                    .withSubject(new Content().withCharset("UTF-8").withData(subject)))
                .withSource(fromEmail);
            
            SendEmailResult result = sesClient.sendEmail(request);
            return result.getMessageId();
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
    
    public void sendBulkEmail(java.util.List<String> toEmails, String subject, String content) {
        sendBulkEmail(toEmails, subject, content, false);
    }
    
    public void sendBulkEmail(java.util.List<String> toEmails, String subject, String content, boolean isHtml) {
        try {
            SendBulkTemplatedEmailRequest request = new SendBulkTemplatedEmailRequest()
                .withSource(fromEmail)
                .withTemplate("DefaultTemplate") // 需要预先在SES中创建模板
                .withDefaultTemplateData("{\"subject\":\"" + subject + "\",\"content\":\"" + content + "\"}")
                .withDestinations(
                    toEmails.stream()
                        .map(email -> new BulkEmailDestination()
                            .withDestination(new Destination().withToAddresses(email))
                            .withReplacementTemplateData("{}"))
                        .toArray(BulkEmailDestination[]::new)
                );
            
            sesClient.sendBulkTemplatedEmail(request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send bulk email: " + e.getMessage(), e);
        }
    }
    
    public boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    public void verifyEmailAddress(String email) {
        try {
            VerifyEmailIdentityRequest request = new VerifyEmailIdentityRequest()
                .withEmailAddress(email);
            sesClient.verifyEmailIdentity(request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify email address: " + e.getMessage(), e);
        }
    }
}