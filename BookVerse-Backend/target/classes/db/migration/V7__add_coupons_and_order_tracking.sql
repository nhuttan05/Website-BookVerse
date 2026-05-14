-- V7: Add coupons table, order_status_history, and alter orders table

-- Coupon table
CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    discount_type VARCHAR(20) NOT NULL COMMENT 'PERCENTAGE or FIXED',
    discount_value DECIMAL(12,2) NOT NULL,
    min_order_amount DECIMAL(12,2),
    max_discount_amount DECIMAL(12,2),
    max_uses INT,
    used_count INT DEFAULT 0,
    expiry_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order status history
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    note VARCHAR(500),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Add coupon fields to orders
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(12,2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);

-- Seed some sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, expiry_date, is_active)
VALUES
    ('WELCOME10', 'Giảm 10% cho đơn hàng đầu tiên', 'PERCENTAGE', 10.00, 0.00, 1000, DATE_ADD(NOW(), INTERVAL 1 YEAR), TRUE),
    ('SAVE50K',   'Giảm 50,000₫ cho đơn từ 200,000₫', 'FIXED', 50000.00, 200000.00, 500, DATE_ADD(NOW(), INTERVAL 6 MONTH), TRUE),
    ('BOOKS20',   'Giảm 20% tối đa 100,000₫', 'PERCENTAGE', 20.00, 150000.00, 200, DATE_ADD(NOW(), INTERVAL 3 MONTH), TRUE),
    ('SUMMER100K','Ưu đãi hè - Giảm 100,000₫ cho đơn từ 500,000₫', 'FIXED', 100000.00, 500000.00, 100, DATE_ADD(NOW(), INTERVAL 2 MONTH), TRUE);
