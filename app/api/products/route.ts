// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import { handleApiError } from '@/lib/utils/api-error-handler';

/**
 * Obtiene todos los productos disponibles
 */
export async function GET() {
  try {
    await connectDB();

    // Buscar solo productos con stock disponible y activos
    const products = await ProductModel.find({
      stock: { $gt: 0 }, // Solo productos con stock > 0
    }).sort({ createdAt: -1 }); // Ordenar por más recientes primero

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
