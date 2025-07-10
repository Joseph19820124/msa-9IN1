FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/kitchen-service-1.0.0.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]