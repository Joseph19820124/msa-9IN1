FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/delivery-service-1.0.0.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]