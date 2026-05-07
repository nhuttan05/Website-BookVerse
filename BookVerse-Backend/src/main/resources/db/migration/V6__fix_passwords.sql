-- V6__fix_passwords.sql
-- Cập nhật lại mật khẩu chuẩn cho các tài khoản nếu đã tồn tại

-- Cập nhật Admin (admin / admin)
UPDATE users 
SET password = '$2a$10$0OQQs4HhharzVp1x4uC9pelyhN8qEneS3owR6koq1IvrEzW5s5FR2'
WHERE email = 'admin@bookverse.com';

-- Cập nhật Customer (nhuttan / 123456)
UPDATE users 
SET password = '$2a$10$oiibxkevGiK5.DK4ob2bhu88fSVZzsiKsfLuEE1Dk50nodrOtJo9e'
WHERE email = 'nhuttan@bookverse.com';
