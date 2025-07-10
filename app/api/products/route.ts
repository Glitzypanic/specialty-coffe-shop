// app/api/products/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ProductModel from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}
