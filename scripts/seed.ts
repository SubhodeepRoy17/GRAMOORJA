import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

const products = [
  {
    name: "Premium Kanakchur Muri Ladoo",
    price: 299,
    weight: "500g",
    rating: 4.8,
    reviews: 156,
    description: "Traditional handcrafted sweets",
    category: "ladoo",
    image: "/laddoo.jpg",
    stock: 100,
    isFeatured: true,
  },
  {
    name: "Deluxe Gift Box",
    price: 599,
    weight: "1kg",
    rating: 4.9,
    reviews: 89,
    description: "Perfect for celebrations",
    category: "gift",
    image: "/laddoo.jpg",
    stock: 50,
    isFeatured: true,
  },
  // Add more products...
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    console.log('Database cleared');

    // Import models
    const User = require('../lib/models/User').default;
    const Product = require('../lib/models/Product').default;

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ghoroa.com',
      phone: '+91 9876543210',
      address: 'Kolkata, India',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created:', admin.email);

    // Create sample user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      phone: '+91 9876543211',
      address: 'Delhi, India',
      password: userPassword,
    });
    console.log('Test user created:', user.email);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();