import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { getCurrentUser } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const post = await Blog.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    console.error('Get blog post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const User = require('@/lib/models/User').default;
    const currentUser = await User.findById(user.userId);
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Check if slug already exists (excluding current post)
    if (body.slug) {
      const existingPost = await Blog.findOne({ 
        slug: body.slug,
        _id: { $ne: params.id }
      });
      
      if (existingPost) {
        return NextResponse.json(
          { success: false, error: 'Blog post with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const post = await Blog.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    });
  } catch (error: any) {
    console.error('Update blog post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const User = require('@/lib/models/User').default;
    const currentUser = await User.findById(user.userId);
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const post = await Blog.findByIdAndDelete(params.id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete blog post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}