-- V3__seed_categories.sql
INSERT IGNORE INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

INSERT IGNORE INTO categories (id, name, slug) VALUES 
(1, 'Nghệ thuật & Thiết kế', 'arts-design'),
(2, 'Khoa học', 'science'),
(3, 'Lịch sử', 'history'),
(4, 'Văn học', 'literature'),
(5, 'Kinh doanh', 'business'),
(6, 'Triết học', 'philosophy'),
(7, 'Công nghệ', 'technology'),
(8, 'Tự phát triển', 'self-development');
