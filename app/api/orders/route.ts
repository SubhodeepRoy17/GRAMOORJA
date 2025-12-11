import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/lib/models/Order';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Check if admin
    const User = require('@/lib/models/User').default;
    const currentUser = await User.findById(user.userId);
    
    let query: any = {};
    
    if (currentUser.role !== 'admin') {
      // Regular users can only see their own orders
      query.user = user.userId;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { shippingAddress, paymentMethod } = body;

    // Get user's cart
    const cart = await Cart.findOne({ user: user.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    const items = cart.items.map((item: any) => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      
      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        weight: item.product.weight,
      };
    });

    const tax = subtotal * 0.05;
    const shipping = subtotal > 500 ? 0 : 40;
    const total = subtotal + tax + shipping;

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create order
    const order = await Order.create({
      orderId,
      user: user.userId,
      items,
      total,
      tax,
      shipping,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      shippingAddress,
      status: 'pending',
    });

    // Clear cart
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        data: order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}