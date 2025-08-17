// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import ProductModel from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { CartSchema, ApiError, CartErrorCodes } from '@/lib/validations/cart';
import {
  handleApiError,
  validateAuthentication,
} from '@/lib/utils/api-error-handler';

/**
 * Obtiene el carrito del usuario autenticado
 */
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Permitir acceso sin autenticación, devolver carrito vacío
    if (!session?.user?.email) {
      return NextResponse.json({ cart: [] }, { status: 200 });
    }

    const user = await User.findOne({ email: session.user.email }).select(
      'cart'
    );
    if (!user || !user.cart) {
      return NextResponse.json({ cart: [] }, { status: 200 });
    }

    // Poblar carrito con datos completos del producto y filtrar productos inválidos
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
    return handleApiError(error);
  }
}

/**
 * Actualiza el carrito del usuario autenticado
 */
export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Validar autenticación
    validateAuthentication(session);

    // Validar datos de entrada
    const body = await request.json();
    const validatedData = CartSchema.parse(body);

    const user = await User.findOne({ email: session!.user!.email });
    if (!user) {
      throw new ApiError(404, 'User not found', CartErrorCodes.USER_NOT_FOUND);
    }

    // Validar que todos los productos existan y crear carrito válido
    const validCart = [];
    const invalidProducts = [];

    for (const item of validatedData.cart) {
      const productId =
        typeof item.product === 'string' ? item.product : item.product._id;
      const product = await ProductModel.findById(productId);

      if (product) {
        // Verificar stock disponible
        if (product.stock >= item.quantity) {
          validCart.push({
            product: productId,
            quantity: item.quantity,
          });
        } else {
          invalidProducts.push({
            productId,
            reason: `Insufficient stock. Available: ${product.stock}, requested: ${item.quantity}`,
          });
        }
      } else {
        invalidProducts.push({
          productId,
          reason: 'Product not found',
        });
      }
    }

    // Si hay productos inválidos, devolver error con detalles
    if (invalidProducts.length > 0) {
      throw new ApiError(
        400,
        'Some products are invalid or unavailable',
        CartErrorCodes.INVALID_PRODUCT
      );
    }

    // Actualizar carrito del usuario
    user.cart = validCart;
    await user.save();

    // Devolver carrito poblado
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
    return handleApiError(error);
  }
}
