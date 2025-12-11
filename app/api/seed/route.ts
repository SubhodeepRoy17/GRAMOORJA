// app/api/seed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';

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
];

export async function GET(req: NextRequest) {
  try {
    // Optional: Add authentication check for admin
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }

    // Clear existing data
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    console.log('Database cleared');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ghoroa.com',
      phone: '+91 9876543210',
      address: 'Kolkata, India',
      password: 'admin123',
      role: 'admin',
    });

    // Create sample user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      phone: '+91 9876543211',
      address: 'Delhi, India',
      password: userPassword,
    });

    // Create products
    const createdProducts = await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        admin: { email: admin.email },
        user: { email: user.email },
        products: createdProducts.length
      }
    });

  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}