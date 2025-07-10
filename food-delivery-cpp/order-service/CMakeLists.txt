cmake_minimum_required(VERSION 3.16)
project(order-service)

set(CMAKE_CXX_STANDARD 17)

# Find required packages
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBPQXX REQUIRED libpqxx)

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)
include_directories(${CMAKE_SOURCE_DIR}/third_party)

# Add executable
add_executable(order-service 
    src/main.cpp
    src/order_service.cpp
    src/database.cpp
    src/models/order.cpp
    src/http_client.cpp
)

# Link libraries
target_link_libraries(order-service ${LIBPQXX_LIBRARIES})
target_compile_options(order-service PRIVATE ${LIBPQXX_CFLAGS_OTHER})

# Compiler-specific options
if(CMAKE_CXX_COMPILER_ID STREQUAL "GNU" OR CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
    target_compile_options(order-service PRIVATE -Wall -Wextra -O3)
endif()