-- V2__add_book_images_table.sql
CREATE TABLE book_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Index for faster retrieval of book images
CREATE INDEX idx_book_images_book_id ON book_images(book_id);
