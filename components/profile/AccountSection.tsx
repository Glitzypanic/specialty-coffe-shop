'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi'; // Icono de edición

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
  const [editableFields, setEditableFields] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar si se está editando
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleEditable = (field: keyof typeof editableFields) => {
    const updatedEditableFields = {
      ...editableFields,
      [field]: !editableFields[field],
    };
    setEditableFields(updatedEditableFields);
    setIsEditing(Object.values(updatedEditableFields).some((value) => value)); // Verifica si algún campo está en modo edición
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
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
      setEditableFields({ name: false, email: false, phone: false }); // Desactiva todos los campos
      setIsEditing(false); // Desactiva el estado de edición
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
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        {['name', 'email', 'phone'].map((field) => (
          <div key={field} className="relative items-center">
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-400"
            >
              {field === 'name'
                ? 'Nombre'
                : field === 'email'
                ? 'Correo Electrónico'
                : 'Teléfono'}
            </label>
            <div className="flex items-center">
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                id={field}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                disabled={!editableFields[field as keyof typeof editableFields]}
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${
                  editableFields[field as keyof typeof editableFields]
                    ? 'bg-white'
                    : 'bg-gray-100'
                }`}
                required
              />
              <button
                type="button"
                onClick={() =>
                  toggleEditable(field as keyof typeof editableFields)
                }
                className="absolute right-2 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                <FiEdit2 />
              </button>
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={!isEditing || loading} // Desactivado si no se está editando
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50 disabled:bg-gray-400 cursor-pointer"
        >
          {loading ? 'Guardando...' : 'Aplicar cambios'}
        </button>
        {success && <p className="text-green-600 text-center">{success}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </section>
  );
}
