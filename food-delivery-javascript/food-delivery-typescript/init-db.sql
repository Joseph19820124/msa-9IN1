-- Food Delivery Microservices Database Initialization
-- This script creates separate databases for each microservice

-- Create databases for each service
CREATE DATABASE IF NOT EXISTS order_db;
CREATE DATABASE IF NOT EXISTS restaurant_db;
CREATE DATABASE IF NOT EXISTS kitchen_db;
CREATE DATABASE IF NOT EXISTS delivery_db;
CREATE DATABASE IF NOT EXISTS accounting_db;
CREATE DATABASE IF NOT EXISTS notification_db;

-- Create a common user for all services (in production, use separate users)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'food_delivery_user') THEN
      
      CREATE ROLE food_delivery_user LOGIN PASSWORD 'food_delivery_password';
   END IF;
END
$do$;

-- Grant privileges to the user for all databases
GRANT ALL PRIVILEGES ON DATABASE order_db TO food_delivery_user;
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO food_delivery_user;
GRANT ALL PRIVILEGES ON DATABASE kitchen_db TO food_delivery_user;
GRANT ALL PRIVILEGES ON DATABASE delivery_db TO food_delivery_user;
GRANT ALL PRIVILEGES ON DATABASE accounting_db TO food_delivery_user;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO food_delivery_user;

-- Enable UUID extension for all databases
\c order_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c restaurant_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c kitchen_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c delivery_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c accounting_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c notification_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Switch back to the default database
\c food_delivery;

COMMIT;