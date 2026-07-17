-- Smart Mart E-Commerce Database Schema
-- PostgreSQL

DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    num_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(200),
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'card',
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password_hash, full_name, phone, address, is_admin) VALUES
('admin', 'admin@smartmart.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYMyzJ/I1K', 'Admin User', '9876543210', '123 Admin Street, Delhi', TRUE),
('john_doe', 'john@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYMyzJ/I1K', 'John Doe', '9876543211', '456 Park Avenue, Mumbai', FALSE),
('jane_smith', 'jane@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYMyzJ/I1K', 'Jane Smith', '9876543212', '789 Lake Road, Bangalore', FALSE);

INSERT INTO products (name, description, price, category, image_url, stock_quantity, rating, num_reviews) VALUES
('Wireless Bluetooth Headphones', 'Premium noise-cancelling headphones with 30-hour battery life', 2999.00, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 50, 4.5, 120),
('Smart Watch Pro', 'Fitness tracking, heart rate monitor, GPS enabled smart watch', 4999.00, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 30, 4.3, 85),
('Organic Cotton T-Shirt', '100% organic cotton, comfortable fit, eco-friendly', 599.00, 'Fashion', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 100, 4.2, 200),
('Running Shoes', 'Lightweight breathable running shoes with cushioned sole', 3499.00, 'Fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 40, 4.6, 150),
('Stainless Steel Water Bottle', 'Insulated bottle keeps drinks hot/cold for 12 hours', 799.00, 'Home', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 80, 4.4, 95),
('Yoga Mat', 'Non-slip, extra thick yoga mat with carrying strap', 1299.00, 'Sports', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 60, 4.7, 110),
('Wireless Mouse', 'Ergonomic wireless mouse with 2.4GHz connectivity', 899.00, 'Electronics', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 70, 4.1, 75),
('Backpack', 'Water-resistant laptop backpack with USB charging port', 1999.00, 'Fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 45, 4.5, 130),
('Coffee Maker', 'Automatic drip coffee maker with programmable timer', 2499.00, 'Home', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400', 25, 4.3, 60),
('Desk Lamp LED', 'Adjustable LED desk lamp with touch control', 699.00, 'Home', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', 90, 4.0, 45);

INSERT INTO cart_items (user_id, product_id, quantity) VALUES
(2, 1, 1),
(2, 3, 2),
(3, 2, 1),
(3, 5, 1);

INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES
(2, 3598.00, 'delivered', '456 Park Avenue, Mumbai, 400001'),
(2, 1299.00, 'shipped', '456 Park Avenue, Mumbai, 400001'),
(3, 4999.00, 'pending', '789 Lake Road, Bangalore, 560001');

INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES
(1, 1, 'Wireless Bluetooth Headphones', 2999.00, 1),
(1, 3, 'Organic Cotton T-Shirt', 599.00, 1),
(2, 6, 'Yoga Mat', 1299.00, 1),
(3, 2, 'Smart Watch Pro', 4999.00, 1);

INSERT INTO payments (order_id, user_id, amount, payment_method, status, transaction_id) VALUES
(1, 2, 3598.00, 'card', 'completed', 'TXN123456789'),
(2, 2, 1299.00, 'upi', 'completed', 'TXN987654321'),
(3, 3, 4999.00, 'card', 'pending', 'TXN456789123');

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);