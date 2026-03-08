/* eslint-disable no-console */
/**
 * Seed script for SphereTest backend.
 *
 * How to run:
 *   1. Make sure MongoDB is running.
 *   2. From the backend folder, run:
 *        node seedData.js
 *
 * This will insert:
 *   - 1 admin user
 *   - 2 student users
 *   - 1 sphere
 *   - 3 questions for that sphere
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Sphere = require('./src/models/Sphere');
const Question = require('./src/models/Question');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing data (users, spheres, questions)...');
    await Question.deleteMany({});
    await Sphere.deleteMany({});
    await User.deleteMany({});

    console.log('👤 Creating users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@spheretest.com',
      role: 'admin',
    });

    const student1 = await User.create({
      name: 'Student One',
      email: 'student1@spheretest.com',
      role: 'student',
    });

    const student2 = await User.create({
      name: 'Student Two',
      email: 'student2@spheretest.com',
      role: 'student',
    });

    console.log('🌀 Creating sphere...');
    const sphere = await Sphere.create({
      title: 'Sample Sphere',
      description: 'Demo sphere seeded for testing',
      createdBy: adminUser._id,
      participants: [adminUser._id, student1._id, student2._id],
    });

    console.log('❓ Creating questions...');
    const questionsData = [
      {
        sphereId: sphere._id,
        questionText: 'What is 2 + 2?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '4',
      },
      {
        sphereId: sphere._id,
        questionText: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correctAnswer: 'Paris',
      },
      {
        sphereId: sphere._id,
        questionText: 'Which language runs in a web browser?',
        options: ['Python', 'Java', 'C++', 'JavaScript'],
        correctAnswer: 'JavaScript',
      },
    ];

    await Question.insertMany(questionsData);

    console.log('✅ Seed data created successfully.');
    console.log('Admin user email:', adminUser.email);
    console.log('Sphere ID:', sphere._id.toString());
    console.log('You can use this Sphere ID in your API tests and Postman collection.');
  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();

