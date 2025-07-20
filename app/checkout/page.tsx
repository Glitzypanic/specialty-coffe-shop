'use client';

import { useState, FormEvent } from 'react';
import { useCart } from '@/components/ecommerce/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula un delay
      setShowSuccessModal(true);
      clearCart(); // Limpia el carrito después de la compra
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage('Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setFormData({ name: '', email: '', address: '' });
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-coffee mb-6">Finalizar Compra</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">
          Tu carrito está vacío.{' '}
          <Link href="/products" className="text-green-500 hover:underline">
            Volver a productos
          </Link>
          .
        </p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Resumen del Carrito</h2>
          <ul className="mb-6 space-y-2">
            {cart.map((item) => (
              <li key={item.product._id} className="flex justify-between">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="text-right text-xl font-bold mb-6">
            Total: ${total.toFixed(2)}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50"
                aria-label="Nombre completo"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50"
                aria-label="Correo electrónico"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Dirección de Envío
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50"
                aria-label="Dirección de envío"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 disabled:bg-gray-400"
              aria-label="Finalizar compra"
            >
              {isSubmitting ? 'Procesando...' : 'Finalizar Compra'}
            </button>
            {message && (
              <p className="mt-2 text-center text-red-600">{message}</p>
            )}
          </form>
        </>
      )}

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-mx mx-4 text-center">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Compra Exitosa!
              </h3>
              <p className="text-gray-600 mb-6">
                Gracias por tu pedido. Hemos recibido tu compra correctamente y
                pronto recibirás un correo de confirmación.
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={closeModal}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                Continuar Comprando
              </button>
              <Link
                href="/products"
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-center"
                onClick={closeModal}
              >
                Ver Productos
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
