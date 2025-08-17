'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AccountSectionProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    phone?: string | null;
  };
}

export default function AccountSection({ user }: AccountSectionProps) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [display, setDisplay] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    // Validación de formato de teléfono internacional (ej: +52 1234567890)
    const phoneRegex = /^\+\d{1,3}\s?\d{6,14}$/;
    if (!phoneRegex.test(form.phone)) {
      setError(
        'El teléfono debe incluir el código de país y ser válido. Ejemplo: +52 1234567890'
      );
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Error al actualizar');
      }
      setSuccess('Datos actualizados correctamente');
      setDisplay({ ...form }); // Actualiza los datos mostrados inmediatamente
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al actualizar');
      } else {
        setError('Error al actualizar');
      }
    }
    setLoading(false);
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Gestión de la cuenta</h2>
      <div className="flex items-center gap-4 mb-6">
        {user.image && (
          <Image
            src={user.image}
            alt="Avatar"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full border"
          />
        )}
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-4">
            <div className="font-semibold text-lg">Nombre:</div>
            <div className="text-gray-400 text-xl">{display.name}</div>
          </div>
          <div className="flex flex-row gap-4 ">
            <div className="font-semibold text-lg">Correo:</div>
            <div className="text-gray-400 text-xl">{display.email}</div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="font-semibold text-lg">Telefono:</div>
            <div className="text-gray-400 text-xl">{display.phone}</div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400"
          >
            Nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-400"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-400"
          >
            Teléfono
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coffee text-white py-2 rounded-md hover:bg-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50 disabled:bg-gray-400 cursor-pointer j"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
        {success && <p className="text-green-600 text-center">{success}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </section>
  );
}
