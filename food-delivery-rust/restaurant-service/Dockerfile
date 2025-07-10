# Build stage
FROM rust:1.75 as builder

WORKDIR /app

# Copy the shared library first
COPY shared /shared

# Copy the restaurant-service
COPY restaurant-service/Cargo.toml restaurant-service/Cargo.lock* ./
COPY restaurant-service/src ./src
COPY restaurant-service/migrations ./migrations

# Update the shared dependency path
RUN sed -i 's|path = "../shared"|path = "/shared"|' Cargo.toml

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/restaurant-service /app/restaurant-service
COPY --from=builder /app/migrations /app/migrations

EXPOSE 8080

CMD ["./restaurant-service"]