import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { name, email, phone, address, password } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    console.log('Creating user with PLAIN password:', {
      email,
      passwordLength: password.length
    });

    // Create new user with PLAIN password
    // The User model's pre-save hook will hash it automatically
    const user = await User.create({
      name,
      email,
      phone,
      address,
      password: password, // Pass PLAIN password here
    });

    console.log('User created successfully:', {
      email: user.email,
      _id: user._id,
      // Don't log the actual password
    });

    // Generate token
    const token = generateToken(user._id.toString());
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    return setAuthCookie(token, response);
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed: ' + error.message },
      { status: 500 }
    );
  }
}