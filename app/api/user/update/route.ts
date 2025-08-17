import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { name, email, phone } = await request.json();
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }
    // Validación de formato de teléfono internacional (ej: +52 1234567890)
    const phoneRegex = /^\+\d{1,3}\s?\d{6,14}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        {
          error:
            'El teléfono debe incluir el código de país y ser válido. Ejemplo: +52 1234567890',
        },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    await user.save();
    return NextResponse.json(
      { message: 'Datos actualizados correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}
