-- Create databases for each microservice
CREATE DATABASE order_service;
CREATE DATABASE restaurant_service;
CREATE DATABASE kitchen_service;
CREATE DATABASE delivery_service;
CREATE DATABASE accounting_service;
CREATE DATABASE notification_service;

-- Create users for each service (optional, for better security)
-- CREATE USER order_user WITH PASSWORD 'order_pass';
-- CREATE USER restaurant_user WITH PASSWORD 'restaurant_pass';
-- CREATE USER kitchen_user WITH PASSWORD 'kitchen_pass';
-- CREATE USER delivery_user WITH PASSWORD 'delivery_pass';
-- CREATE USER accounting_user WITH PASSWORD 'accounting_pass';
-- CREATE USER notification_user WITH PASSWORD 'notification_pass';

-- Grant privileges (optional)
-- GRANT ALL PRIVILEGES ON DATABASE order_service TO order_user;
-- GRANT ALL PRIVILEGES ON DATABASE restaurant_service TO restaurant_user;
-- GRANT ALL PRIVILEGES ON DATABASE kitchen_service TO kitchen_user;
-- GRANT ALL PRIVILEGES ON DATABASE delivery_service TO delivery_user;
-- GRANT ALL PRIVILEGES ON DATABASE accounting_service TO accounting_user;
-- GRANT ALL PRIVILEGES ON DATABASE notification_service TO notification_user;