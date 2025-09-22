import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import mongoose from 'mongoose';

/**
 * Obtiene un producto específico por su ID
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Conectar a la base de datos
    await connectDB();

    const { id } = params;

    // Validar si el ID es un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    // Buscar el producto por su ID
    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error al recuperar el producto:', error);
    return NextResponse.json(
      { message: 'Error al recuperar el producto' },
      { status: 500 }
    );
  }
}
