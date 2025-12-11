import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/lib/models/Blog';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const post = await Blog.findById(params.id).select('comments');
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post.comments || [],
    });
  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { name, email, content } = body;

    if (!name || !email || !content) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and content are required' },
        { status: 400 }
      );
    }

    const comment = {
      name,
      email,
      content,
      createdAt: new Date(),
    };

    const post = await Blog.findByIdAndUpdate(
      params.id,
      { $push: { comments: comment } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
    });
  } catch (error: any) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}