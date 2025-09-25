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
  phone: z
    .string()
    .min(6, 'El número debe tener al menos 6 dígitos')
    .refine((val) => val.length > 0, { message: 'El número es requerido' }),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .nonempty('La contraseña es requerida'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('+34'); // Default Spain
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', phone: '' },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setError('');
    try {
      // Concatenar código de país y número, y formatear internacional
      const phoneInternational = countryCode + data.phone.replace(/^0+/, '');
      const payload = { ...data, phone: phoneInternational };
      // Registrar el usuario
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Número Telefónico
          </label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="p-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="+34">🇪🇸 +34 (España)</option>
              <option value="+52">🇲🇽 +52 (México)</option>
              <option value="+1">🇺🇸 +1 (EE.UU.)</option>
              <option value="+57">🇨🇴 +57 (Colombia)</option>
              <option value="+56">🇨🇱 +56 (Chile)</option>
              <option value="+51">🇵🇪 +51 (Perú)</option>
              <option value="+54">🇦🇷 +54 (Argentina)</option>
              <option value="+55">🇧🇷 +55 (Brasil)</option>
              <option value="+593">🇪🇨 +593 (Ecuador)</option>
              <option value="+591">🇧🇴 +591 (Bolivia)</option>
              <option value="+598">🇺🇾 +598 (Uruguay)</option>
              <option value="+502">🇬🇹 +502 (Guatemala)</option>
              <option value="+503">🇸🇻 +503 (El Salvador)</option>
              <option value="+504">🇭🇳 +504 (Honduras)</option>
              <option value="+505">🇳🇮 +505 (Nicaragua)</option>
              <option value="+506">🇨🇷 +506 (Costa Rica)</option>
              <option value="+507">🇵🇦 +507 (Panamá)</option>
              <option value="+58">🇻🇪 +58 (Venezuela)</option>
              <option value="+53">🇨🇺 +53 (Cuba)</option>
              <option value="+1">🇨🇦 +1 (Canadá)</option>
            </select>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50"
              aria-label="Número telefónico"
              placeholder="Ej: 612345678"
            />
          </div>
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone.message}</p>
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
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <a
          href="/auth/signin"
          className="text-coffee font-bold hover:underline"
        >
          Inicia sesión aquí
        </a>
      </p>
    </main>
  );
}
