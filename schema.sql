-- Re-initializing database
DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

-- Creating table of products
CREATE TABLE products (
    -- unique identifier
    item_id VARCHAR(38) NOT NULL,
    -- other product attributes
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10,4) NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)
);