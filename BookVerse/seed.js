import { fakerVI as faker } from '@faker-js/faker';
import fs from 'fs';

const TARGET_BOOKS = 5000;

function generateSeed() {
  console.log(`Generating seed for ${TARGET_BOOKS} books...`);

  // We assume category IDs 1 to 5 exist based on typical seed data.
  const categoryIds = [1, 2, 3, 4, 5, 6, 7, 8];

  const BATCH_SIZE = 500;
  let totalInserted = 0;
  
  let sql = 'SET NAMES utf8mb4;\n';
  sql += 'SET FOREIGN_KEY_CHECKS = 0;\n';
  
  for (let i = 0; i < TARGET_BOOKS; i += BATCH_SIZE) {
    const currentBatchSize = Math.min(BATCH_SIZE, TARGET_BOOKS - i);
    
    sql += `INSERT IGNORE INTO books (
        title, slug, description, price, original_price, discount_percent, cover_image_url,
        category_id, author, rating, review_count, is_editor_choice, is_featured, is_bestseller,
        is_new_arrival, isbn, publisher, page_count, published_date, language, stock_quantity
      ) VALUES \n`;

    for (let j = 0; j < currentBatchSize; j++) {
      const title = faker.lorem.words({ min: 2, max: 7 });
      const slug = faker.helpers.slugify(title).toLowerCase() + '-' + faker.string.alphanumeric(6);
      const description = faker.lorem.paragraphs(3).replace(/'/g, "\\'");
      
      const originalPrice = faker.number.int({ min: 50, max: 500 }) * 1000;
      const discountPercent = faker.helpers.arrayElement([0, 0, 10, 15, 20, 25, 30, 50]);
      const price = originalPrice * (1 - discountPercent / 100);
      
      const coverImageUrl = `https://images.unsplash.com/photo-${faker.helpers.arrayElement([
        '1544947950-fa07a98d237f', '1512820790803-83ca734da794', '1589829085413-56de8ae18c73', 
        '1497633762265-9d179a990aa6', '1461360370896-922624d12aa1', '1451187580459-43490279c0fa',
        '1513364776144-60967b0f800f', '1532187863486-abf9d3a4461a', '1506126613408-eca07ce68773',
        '1476275466078-4007374efbbe', '1544716278-ca5e3f4abd8c', '1592492159418-39f319320569',
        '1507842217343-583bb7270b66', '1516116216624-53e697fedbea'
      ])}?q=80&w=800&auto=format&fit=crop`;

      const categoryId = faker.helpers.arrayElement(categoryIds);
      const author = faker.person.fullName().replace(/'/g, "\\'");
      const rating = faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 });
      const reviewCount = faker.number.int({ min: 0, max: 1000 });
      const isEditorChoice = faker.datatype.boolean({ probability: 0.1 }) ? 1 : 0;
      const isFeatured = faker.datatype.boolean({ probability: 0.15 }) ? 1 : 0;
      const isBestseller = faker.datatype.boolean({ probability: 0.1 }) ? 1 : 0;
      const isNewArrival = faker.datatype.boolean({ probability: 0.2 }) ? 1 : 0;
      const isbn = faker.commerce.isbn(13);
      const publisher = (faker.company.name() + ' Publisher').replace(/'/g, "\\'");
      const pageCount = faker.number.int({ min: 100, max: 1000 });
      const publishedDate = faker.date.past({ years: 20 }).toISOString().split('T')[0];
      const language = faker.helpers.arrayElement(['Tiếng Việt', 'English']);
      const stockQuantity = faker.number.int({ min: 0, max: 500 });

      sql += `('${title}', '${slug}', '${description}', ${price}, ${originalPrice}, ${discountPercent}, '${coverImageUrl}', ${categoryId}, '${author}', ${rating}, ${reviewCount}, ${isEditorChoice}, ${isFeatured}, ${isBestseller}, ${isNewArrival}, '${isbn}', '${publisher}', ${pageCount}, '${publishedDate}', '${language}', ${stockQuantity})`;
      
      if (j === currentBatchSize - 1) {
        sql += ';\n';
      } else {
        sql += ',\n';
      }
    }

    totalInserted += currentBatchSize;
    console.log(`Generated ${totalInserted} / ${TARGET_BOOKS} books...`);
  }

  sql += 'SET FOREIGN_KEY_CHECKS = 1;\n';
  fs.writeFileSync('seed.sql', sql);
  console.log('Successfully wrote to seed.sql!');
}

generateSeed();
