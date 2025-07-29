'use client';

import { useState } from 'react';
import { useCart } from '@/components/ecommerce/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState('info');

  // Estados para los formularios
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    city: '',
    postalCode: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  // Estados para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            className="inline-block bg-coffee text-white py-2 px-6 rounded-md hover:bg-coffee/90 focus:outline-none focus:ring-2 focus:ring-coffee"
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

  // Funciones de validación
  const validateContactInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!contactInfo.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (contactInfo.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!contactInfo.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (
      !/^[\d\s\-\+\(\)]{10,}$/.test(contactInfo.phone.replace(/\s/g, ''))
    ) {
      newErrors.phone = 'El teléfono debe tener al menos 10 dígitos';
    }

    return newErrors;
  };

  const validateShippingInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.street.trim()) {
      newErrors.street = 'La dirección es requerida';
    } else if (shippingInfo.street.trim().length < 5) {
      newErrors.street = 'La dirección debe tener al menos 5 caracteres';
    }

    if (!shippingInfo.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    } else if (shippingInfo.city.trim().length < 2) {
      newErrors.city = 'La ciudad debe tener al menos 2 caracteres';
    }

    if (!shippingInfo.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es requerido';
    } else if (!/^\d{4,6}$/.test(shippingInfo.postalCode.trim())) {
      newErrors.postalCode = 'El código postal debe tener entre 4 y 6 dígitos';
    }

    return newErrors;
  };

  const validatePaymentInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentInfo.cardNumber.trim()) {
      newErrors.cardNumber = 'El número de tarjeta es requerido';
    } else if (!/^\d{13,19}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber =
        'El número de tarjeta debe tener entre 13 y 19 dígitos';
    }

    if (!paymentInfo.expiryDate.trim()) {
      newErrors.expiryDate = 'La fecha de vencimiento es requerida';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/AA)';
    } else {
      // Validar que la fecha no sea en el pasado
      const [month, year] = paymentInfo.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = 'La tarjeta está vencida';
      }
    }

    if (!paymentInfo.cvv.trim()) {
      newErrors.cvv = 'El CVV es requerido';
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = 'El CVV debe tener 3 o 4 dígitos';
    }

    if (!paymentInfo.cardholderName.trim()) {
      newErrors.cardholderName = 'El nombre del titular es requerido';
    } else if (paymentInfo.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'El nombre debe tener al menos 2 caracteres';
    }

    return newErrors;
  };

  // Función para formatear el número de tarjeta
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Función para formatear la fecha de expiración
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Función para avanzar al siguiente paso con validación
  const nextStep = () => {
    let validationErrors: Record<string, string> = {};

    if (currentStep === 'info') {
      validationErrors = validateContactInfo();
      if (Object.keys(validationErrors).length === 0) {
        validationErrors = { ...validationErrors, ...validateShippingInfo() };
      }
    } else if (currentStep === 'payment') {
      validationErrors = validatePaymentInfo();
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    if (currentStep === 'info') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('confirm');
    }
  };

  const prevStep = () => {
    setErrors({});
    if (currentStep === 'payment') {
      setCurrentStep('info');
    } else if (currentStep === 'confirm') {
      setCurrentStep('payment');
    }
  };

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
                    ? 'bg-coffee text-white'
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
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={contactInfo.name}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, name: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          email: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          phone: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Dirección de Envío
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Calle y número"
                      value={shippingInfo.street}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          street: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                        errors.street ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Ciudad"
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Código postal"
                        value={shippingInfo.postalCode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            postalCode: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                          errors.postalCode
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  className="bg-coffee text-white py-2 px-6 rounded-md hover:bg-coffee/90 focus:outline-none focus:ring-2 focus:ring-coffee"
                >
                  Continuar al Pago
                </button>
              </div>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Información de Pago
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Número de tarjeta"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setPaymentInfo({
                          ...paymentInfo,
                          cardNumber: formatted,
                        });
                      }}
                      maxLength={19}
                      className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          setPaymentInfo({
                            ...paymentInfo,
                            expiryDate: formatted,
                          });
                        }}
                        maxLength={5}
                        className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                          errors.expiryDate
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="CVV"
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cvv: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        maxLength={4}
                        className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Nombre en la tarjeta"
                      value={paymentInfo.cardholderName}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardholderName: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee focus:border-coffee ${
                        errors.cardholderName
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.cardholderName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.cardholderName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Anterior
                </button>
                <button
                  onClick={nextStep}
                  className="bg-coffee text-white py-2 px-6 rounded-md hover:bg-coffee/90 focus:outline-none focus:ring-2 focus:ring-coffee"
                >
                  Revisar Pedido
                </button>
              </div>
            </div>
          )}

          {currentStep === 'confirm' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Confirmar Pedido
                </h3>
                <p className="text-gray-600 mb-6">
                  Revisa tu pedido antes de confirmar la compra.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Información de Contacto
                    </h4>
                    <p className="text-gray-600">{contactInfo.name}</p>
                    <p className="text-gray-600">{contactInfo.email}</p>
                    <p className="text-gray-600">{contactInfo.phone}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Dirección de Envío
                    </h4>
                    <p className="text-gray-600">{shippingInfo.street}</p>
                    <p className="text-gray-600">
                      {shippingInfo.city}, {shippingInfo.postalCode}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Productos
                    </h4>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.product._id}
                          className="flex justify-between py-2 border-b border-gray-200"
                        >
                          <span className="text-gray-700">
                            {item.product.name} x {item.quantity}
                          </span>
                          <span className="font-semibold text-gray-800">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Anterior
                </button>
                <button
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      const res = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          cart: cart.map((item) => ({
                            product: { name: item.product.name },
                            quantity: item.quantity,
                          })),
                          total: Number((total * 1.16).toFixed(2)),
                        }),
                      });
                      if (!res.ok)
                        throw new Error('Error al procesar el pedido');
                      clearCart();
                      alert('¡Pedido confirmado! Gracias por tu compra.');
                      window.location.href = '/products';
                    } catch (err) {
                      alert(
                        'Hubo un error al procesar el pedido. Intenta de nuevo.'
                      );
                    }
                    setIsSubmitting(false);
                  }}
                  disabled={isSubmitting}
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Resumen del Pedido
            </h3>

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {item.product.name} ({item.quantity})
                  </span>
                  <span className="text-gray-800">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
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
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200 text-gray-800">
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
