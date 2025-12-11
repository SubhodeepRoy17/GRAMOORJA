import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
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

    const cart = await Cart.findOne({ user: user.userId }).populate('items.product');
    
    return NextResponse.json({
      success: true,
      data: cart || { items: [], user: user.userId },
    });
  } catch (error: any) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
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
    const { productId, quantity } = body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: user.userId });
    
    if (!cart) {
      cart = await Cart.create({
        user: user.userId,
        items: [],
      });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    await cart.populate('items.product');

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      data: cart,
    });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
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
    const { productId, quantity } = body;

    const cart = await Cart.findOne({ user: user.userId });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date();
    await cart.save();

    await cart.populate('items.product');

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      data: cart,
    });
  } catch (error: any) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const productId = searchParams.get('productId');

    const cart = await Cart.findOne({ user: user.userId });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    if (productId) {
      // Remove specific item
      cart.items = cart.items.filter(
        (item: any) => item.product.toString() !== productId
      );
    } else {
      // Clear entire cart
      cart.items = [];
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json({
      success: true,
      message: productId ? 'Item removed from cart' : 'Cart cleared',
      data: cart,
    });
  } catch (error: any) {
    console.error('Delete cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}