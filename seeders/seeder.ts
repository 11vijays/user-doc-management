import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { DocumentService } from '../src/document/document.service';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { CreateDocumentDto } from '../src/document/dto/create-document.dto';
import { UserRole } from '../src/utils/constant';
import * as faker from '@faker-js/faker';

// ✅ Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seedDatabase() {
  console.log('📌 Starting Database Seeding...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const documentService = app.get(DocumentService);

  // 🌱 Bulk Insert Users
  console.log('🌱 Seeding Users...');
  const users: CreateUserDto[] = [];
  for (let i = 0; i < 1000; i++) {
    users.push({
      userName: faker.faker.internet.userName(),
      firstName: faker.faker.person.firstName(),
      lastName: faker.faker.person.lastName(),
      email: faker.faker.internet.email(),
      password: 'Test@1234', // Default password
      role:
        i % 3 === 0
          ? UserRole.ADMIN
          : i % 2 === 0
            ? UserRole.EDITOR
            : UserRole.VIEWER,
      phone: faker.faker.phone.number({ style: 'national' }),
      tokenVersion: 1,
    });
  }
  await userService.bulkCreate(users); // ✅ Bulk insert users
  console.log('✅ 1000 Users Created');

  // 🌱 Bulk Insert Documents
  console.log('🌱 Seeding Documents...');
  const documents: CreateDocumentDto[] = [];
  for (let i = 0; i < 100000; i++) {
    documents.push({
      name: faker.faker.lorem.words(3),
      fileUrl: `http://localhost:5000/uploads/${faker.faker.string.uuid()}.pdf`,
      description: faker.faker.lorem.sentence(),
    });

    // Insert in batches of 10,000
    if (i > 0 && i % 10000 === 0) {
      await documentService.bulkCreate(documents);
      console.log(`✅ ${i} Documents Seeded...`);
      documents.length = 0; // Clear the array for the next batch
    }
  }

  await app.close();
  console.log('✅ Database Seeding Completed!');
}

seedDatabase();
