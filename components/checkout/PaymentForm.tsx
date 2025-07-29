// components/checkout/PaymentForm.tsx
'use client';

import { useState } from 'react';

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface PaymentFormProps {
  onPaymentSubmit: (paymentData: PaymentData) => Promise<void>;
  isProcessing: boolean;
  orderTotal: number;
}

export default function PaymentForm({
  onPaymentSubmit,
  isProcessing,
  orderTotal,
}: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Nombre del titular requerido';
    }

    const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    const expiry = paymentData.expiryDate.split('/');
    if (
      expiry.length !== 2 ||
      expiry[0].length !== 2 ||
      expiry[1].length !== 2
    ) {
      newErrors.expiryDate = 'Fecha de vencimiento inválida (MM/AA)';
    } else {
      const month = parseInt(expiry[0]);
      const year = parseInt('20' + expiry[1]);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Mes inválido';
      } else if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiryDate = 'La tarjeta está vencida';
      }
    }

    if (
      !paymentData.cvv ||
      paymentData.cvv.length < 3 ||
      paymentData.cvv.length > 4
    ) {
      newErrors.cvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onPaymentSubmit(paymentData);
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setPaymentData((prev) => ({ ...prev, [field]: formattedValue }));

    // Limpiar error específico al empezar a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-coffee mb-4">
        Información de Pago
      </h3>

      {/* Simulación de Stripe - Banner de prueba */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Modo de prueba
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Usa la tarjeta de prueba: 4242 4242 4242 4242 con cualquier
                fecha futura y CVV.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="cardholderName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre del Titular *
          </label>
          <input
            type="text"
            id="cardholderName"
            value={paymentData.cardholderName}
            onChange={(e) =>
              handleInputChange('cardholderName', e.target.value)
            }
            className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
              ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Juan Pérez"
            disabled={isProcessing}
          />
          {errors.cardholderName && (
            <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Número de Tarjeta *
          </label>
          <input
            type="text"
            id="cardNumber"
            value={paymentData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
              ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            disabled={isProcessing}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha de Vencimiento *
            </label>
            <input
              type="text"
              id="expiryDate"
              value={paymentData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
                ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="MM/AA"
              maxLength={5}
              disabled={isProcessing}
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="cvv"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CVV *
            </label>
            <input
              type="text"
              id="cvv"
              value={paymentData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
                ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="123"
              maxLength={4}
              disabled={isProcessing}
            />
            {errors.cvv && (
              <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total a pagar:</span>
            <span className="text-2xl font-bold text-coffee">
              ${orderTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-coffee text-white py-3 px-4 rounded-md font-medium hover:bg-coffee/90 focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Procesando...
            </div>
          ) : (
            `Pagar $${orderTotal.toFixed(2)}`
          )}
        </button>
      </form>

      {/* Información de seguridad */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <div className="flex items-center justify-center space-x-2">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Tus datos están protegidos con encriptación SSL</span>
        </div>
      </div>
    </div>
  );
}
