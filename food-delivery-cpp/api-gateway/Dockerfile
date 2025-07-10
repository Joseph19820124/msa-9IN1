# Multi-stage build for C++ services
FROM gcc:11 AS builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    cmake \
    libpqxx-dev \
    pkg-config \
    wget

WORKDIR /app

# Download cpp-httplib and nlohmann/json
RUN wget https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h -O include/httplib.h
RUN wget https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp -O include/json.hpp

# Copy source code
COPY . .

# Build the application
RUN mkdir build && cd build && \
    cmake .. && \
    make -j$(nproc)

# Runtime stage
FROM ubuntu:22.04

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpqxx-6.4 \
    && rm -rf /var/lib/apt/lists/*

# Copy the built binary
COPY --from=builder /app/build/api-gateway /usr/local/bin/

EXPOSE 3000

CMD ["api-gateway"]