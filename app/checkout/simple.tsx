'use client';

import { useState } from 'react';
import { useCart } from '@/components/ecommerce/CartContext';
import Link from 'next/link';

export default function SimpleCheckoutPage() {
  const { cart, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState('info');

  if (cart.length === 0) {
    return (
      <main className="container mx-auto p-4">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Carrito Vacío
          </h1>
          <p className="text-gray-600 mb-6">
            No tienes productos en tu carrito para proceder con el checkout.
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ver Productos
          </Link>
        </div>
      </main>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Finalizar Compra
      </h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['info', 'payment', 'confirm'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < 2 && <div className="w-16 h-1 bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {currentStep === 'info' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">
                  Dirección de Envío
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Calle y número"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Ciudad"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Código postal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep('payment')}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Continuar al Pago
                </button>
              </div>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">
                  Información de Pago
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Número de tarjeta"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Nombre en la tarjeta"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('info')}
                  className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentStep('confirm')}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Revisar Pedido
                </button>
              </div>
            </div>
          )}

          {currentStep === 'confirm' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Confirmar Pedido</h3>
                <p className="text-gray-600 mb-6">
                  Revisa tu pedido antes de confirmar la compra.
                </p>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex justify-between py-2 border-b"
                    >
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('payment')}
                  className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Anterior
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    alert('¡Pedido confirmado! Gracias por tu compra.');
                    window.location.href = '/products';
                  }}
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Confirmar Pedido
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} ({item.quantity})
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Impuestos:</span>
                <span>${(total * 0.16).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>${(total * 1.16).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
