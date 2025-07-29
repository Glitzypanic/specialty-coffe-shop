// components/checkout/OrderSummary.tsx
'use client';

import Image from 'next/image';
import { useCart } from '@/components/ecommerce/CartContext';
import {
  OrderSummary as OrderSummaryType,
  DiscountCode,
} from '@/types/checkout';
import { useState } from 'react';

interface OrderSummaryProps {
  orderSummary: OrderSummaryType;
  onQuantityChange?: (productId: string, quantity: number) => void;
  onDiscountApply?: (code: string) => void;
  discountCode?: DiscountCode;
  isEditable?: boolean;
}

export default function OrderSummary({
  orderSummary,
  onQuantityChange,
  onDiscountApply,
  discountCode,
  isEditable = false,
}: OrderSummaryProps) {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [discountInput, setDiscountInput] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
      onQuantityChange?.(productId, newQuantity);
    }
  };

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountInput.trim()) return;

    setIsApplyingDiscount(true);
    await onDiscountApply?.(discountInput.trim());
    setIsApplyingDiscount(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-coffee mb-4">
        Resumen del Pedido
      </h3>

      {/* Lista de productos */}
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.product._id} className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                className="object-cover rounded-md"
                sizes="64px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </h4>
              <p className="text-sm text-gray-500">
                ${item.product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {isEditable ? (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity - 1)
                    }
                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity + 1)
                    }
                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-600">x{item.quantity}</span>
              )}

              <div className="w-16 text-right">
                <span className="text-sm font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Código de descuento */}
      {onDiscountApply && (
        <form onSubmit={handleDiscountSubmit} className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              placeholder="Código de descuento"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
            />
            <button
              type="submit"
              disabled={isApplyingDiscount}
              className="px-4 py-2 bg-coffee text-white rounded-md text-sm hover:bg-coffee/90 focus:outline-none focus:ring-2 focus:ring-coffee disabled:opacity-50"
            >
              {isApplyingDiscount ? '...' : 'Aplicar'}
            </button>
          </div>
          {discountCode?.isValid === false && (
            <p className="text-red-500 text-xs mt-1">
              Código de descuento inválido
            </p>
          )}
          {discountCode?.isValid && (
            <p className="text-green-600 text-xs mt-1">¡Descuento aplicado!</p>
          )}
        </form>
      )}

      {/* Totales */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span>${orderSummary.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío:</span>
          <span>
            {orderSummary.shipping === 0
              ? 'Gratis'
              : `$${orderSummary.shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Impuestos:</span>
          <span>${orderSummary.tax.toFixed(2)}</span>
        </div>

        {orderSummary.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Descuento:</span>
            <span>-${orderSummary.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span className="text-coffee">${orderSummary.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
