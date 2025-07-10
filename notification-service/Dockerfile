FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/notification-service-1.0.0.jar app.jar

EXPOSE 8086

ENTRYPOINT ["java", "-jar", "app.jar"]