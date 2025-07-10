# Build stage
FROM rust:1.75 as builder

WORKDIR /app

# Copy the shared library first
COPY shared /shared

# Copy the order-service
COPY order-service/Cargo.toml order-service/Cargo.lock* ./
COPY order-service/src ./src
COPY order-service/migrations ./migrations

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

COPY --from=builder /app/target/release/order-service /app/order-service
COPY --from=builder /app/migrations /app/migrations

EXPOSE 8080

CMD ["./order-service"]