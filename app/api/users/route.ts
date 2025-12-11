import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import { getCurrentUser, hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userData = await User.findById(user.userId).select('-password');
    
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, address, currentPassword, newPassword } = body;

    const userData = await User.findById(user.userId);
    
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update basic info
    if (name) userData.name = name;
    if (phone) userData.phone = phone;
    if (address) userData.address = address;

    // Update password if provided
    if (currentPassword && newPassword) {
      const bcrypt = require('bcryptjs');
      const isValid = await bcrypt.compare(currentPassword, userData.password);
      
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
      
      userData.password = await hashPassword(newPassword);
    }

    await userData.save();

    const userResponse = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      role: userData.role,
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse,
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}