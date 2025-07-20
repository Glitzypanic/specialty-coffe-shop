// app/auth/signup/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  email: z
    .string()
    .email('Debe ser un email válido')
    .nonempty('El email es requerido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .nonempty('La contraseña es requerida'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setError('');
    try {
      // Registrar el usuario
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Error al registrar');
      }

      // Si el registro fue exitoso, hacer signIn inmediatamente
      // NextAuth manejará la redirección y actualización de sesión automáticamente
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/',
        redirect: true, // NextAuth maneja la redirección automáticamente
      });

      // No necesitamos código después de esto porque redirect: true
      // redirige automáticamente y actualiza la sesión
    } catch (err) {
      setError(
        (err as Error).message ||
          'Error al registrar el usuario. Intenta de nuevo.'
      );
      setLoading(false); // Solo establecer loading a false si hay error
    }
    // No ponemos setLoading(false) en finally porque si todo sale bien,
    // la página se redirige y el componente se desmonta
  };

  return (
    <main className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-coffee mb-6">Registrarse</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50"
            aria-label="Nombre"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Correo Electrónico
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50"
            aria-label="Correo electrónico"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50"
            aria-label="Contraseña"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 disabled:bg-gray-400"
          aria-label="Registrarse"
        >
          {loading ? 'Procesando...' : 'Registrarse'}
        </button>
        {error && <p className="mt-2 text-center text-red-600">{error}</p>}
      </form>
    </main>
  );
}
