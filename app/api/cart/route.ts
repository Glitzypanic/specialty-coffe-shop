// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import ProductModel from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ cart: [] }, { status: 200 });

    const user = await User.findOne({ email: session.user.email }).select(
      'cart'
    );
    if (!user || !user.cart) {
      return NextResponse.json({ cart: [] }, { status: 200 });
    }

    // Populate cart with full product data
    const populatedCart = [];
    for (const cartItem of user.cart) {
      const product = await ProductModel.findById(cartItem.product);
      if (product) {
        populatedCart.push({
          product: product,
          quantity: cartItem.quantity,
        });
      }
    }

    return NextResponse.json({ cart: populatedCart }, { status: 200 });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { cart } = await request.json();
    const user = await User.findOne({ email: session.user.email });
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Validate that all products exist and store only the IDs
    const validCart = [];
    for (const item of cart || []) {
      const productId = item.product._id || item.product;
      const product = await ProductModel.findById(productId);
      if (product) {
        validCart.push({
          product: productId,
          quantity: Math.max(1, item.quantity || 1),
        });
      }
    }

    user.cart = validCart;
    await user.save();

    // Return the populated cart
    const populatedCart = [];
    for (const cartItem of validCart) {
      const product = await ProductModel.findById(cartItem.product);
      if (product) {
        populatedCart.push({
          product: product,
          quantity: cartItem.quantity,
        });
      }
    }

    return NextResponse.json({ cart: populatedCart }, { status: 200 });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
