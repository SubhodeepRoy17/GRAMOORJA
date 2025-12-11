import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

// IMPORTANT: Specify Node.js runtime instead of Edge
export const runtime = 'nodejs'; // This forces Node.js runtime

export async function GET(request: NextRequest) {
  try {
    console.log('Verify endpoint called (Node.js runtime)');
    
    // Get token from cookie
    const token = request.cookies.get('ghoroa-token')?.value;
    
    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('Token found, length:', token.length);

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Token verification failed');
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('Token verified, userId:', decoded.userId);
    
    await connectToDatabase();

    // Get user data
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User found:', user.email);

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Verify auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication verification failed' },
      { status: 500 }
    );
  }
}