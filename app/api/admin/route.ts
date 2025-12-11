import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
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
    const currentUser = await User.findById(user.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get dashboard stats
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      revenue,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
      Product.find().sort({ rating: -1 }).limit(5),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          pendingOrders,
          revenue: revenue[0]?.total || 0,
        },
        recentOrders,
        topProducts,
      },
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}