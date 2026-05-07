-- V5__seed_roles_and_users.sql

-- Seed Roles
INSERT IGNORE INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT IGNORE INTO roles (name) VALUES ('ROLE_USER');

-- Seed Admin User (admin / admin)
INSERT IGNORE INTO users (email, password, full_name, avatar_url) 
VALUES ('admin@bookverse.com', '$2a$10$0OQQs4HhharzVp1x4uC9pelyhN8qEneS3owR6koq1IvrEzW5s5FR2', 'Admin BookVerse', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin');

-- Seed Customer User (nhuttan / 123456)
INSERT IGNORE INTO users (email, password, full_name, avatar_url) 
VALUES ('nhuttan@bookverse.com', '$2a$10$oiibxkevGiK5.DK4ob2bhu88fSVZzsiKsfLuEE1Dk50nodrOtJo9e', 'Nhut Tan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tan');

-- Map Roles to Users
-- Get Admin role id
INSERT IGNORE INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'admin@bookverse.com' AND r.name = 'ROLE_ADMIN';

-- Get User role id for Admin too (optional but common)
INSERT IGNORE INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'admin@bookverse.com' AND r.name = 'ROLE_USER';

-- Get User role id for Customer
INSERT IGNORE INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'nhuttan@bookverse.com' AND r.name = 'ROLE_USER';
