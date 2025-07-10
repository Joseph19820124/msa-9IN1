# Build stage
FROM rust:1.75 as builder

WORKDIR /app

# Copy the shared library first
COPY shared /shared

# Copy the api-gateway service
COPY api-gateway/Cargo.toml api-gateway/Cargo.lock* ./
COPY api-gateway/src ./src

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

COPY --from=builder /app/target/release/api-gateway /app/api-gateway

EXPOSE 8080

CMD ["./api-gateway"]