cmake_minimum_required(VERSION 3.16)
project(api-gateway)

set(CMAKE_CXX_STANDARD 17)

# Find required packages
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBPQXX REQUIRED libpqxx)

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)
include_directories(${CMAKE_SOURCE_DIR}/third_party)

# Add executable
add_executable(api-gateway 
    src/main.cpp
    src/api_gateway.cpp
    src/http_client.cpp
)

# Link libraries
target_link_libraries(api-gateway ${LIBPQXX_LIBRARIES})
target_compile_options(api-gateway PRIVATE ${LIBPQXX_CFLAGS_OTHER})