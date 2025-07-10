package com.fooddelivery.kitchen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class KitchenServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(KitchenServiceApplication.class, args);
    }
}