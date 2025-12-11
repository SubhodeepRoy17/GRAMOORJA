import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/lib/models/Blog';

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const post = await Blog.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
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
      message: 'View count updated',
      data: post,
    });
  } catch (error: any) {
    console.error('Update views error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update views' },
      { status: 500 }
    );
  }
}