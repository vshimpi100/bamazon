INSERT INTO products
    ( item_id, product_name, department_name, price, stock_quantity )
VALUES
    (UUID(), "T-Shirt", "Clothing", 12.99, 15), 
    (UUID(), "Pants", "Clothing", 34.99, 10), 
    (UUID(), "TV", "Electronics", 1020.80, 4), 
    (UUID(), "Couch", "Furniture", 800.98, 2), 
    (UUID(), "Chair", "Furniture", 130.98, 20), 
    (UUID(), "Bed", "Furniture", 1200.99, 1), 
    (UUID(), "Computer", "Electronics", 2999.98, 8), 
    (UUID(), "Dog Food", "Pets", 39.98, 80), 
    (UUID(), "Dog Leash", "Pets", 14.98, 14), 
    (UUID(), "Dog Bowl", "Pets", 9.99, 12);

SELECT * FROM products;