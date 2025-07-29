import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { cart, total } = await request.json();
    if (!cart || !Array.isArray(cart) || cart.length === 0 || !total) {
      return NextResponse.json(
        { error: 'Datos de compra inválidos' },
        { status: 400 }
      );
    }
    // Guardar el pedido
    await Order.create({
      userEmail: session.user.email,
      date: new Date(),
      total,
      items: cart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
      })),
    });
    // Limpiar el carrito del usuario
    await User.updateOne({ email: session.user.email }, { $set: { cart: [] } });
    return NextResponse.json(
      { message: 'Compra realizada y pedido guardado' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en checkout:', error);
    return NextResponse.json(
      { error: 'Error al procesar la compra' },
      { status: 500 }
    );
  }
}
