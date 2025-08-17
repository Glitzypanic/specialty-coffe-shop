'use client';

import { useCart } from './CartContext';
import Link from 'next/link';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return <p className="text-center text-gray-600">Tu carrito está vacío.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-coffee mb-4">
        Carrito de Compras
      </h2>
      <ul className="space-y-4">
        {cart.map((item) => (
          <li
            key={item.product._id}
            className="flex justify-between items-center border-b pb-2"
          >
            <span>
              {item.product.name} x {item.quantity}
            </span>
            <div>
              <span className="mr-4">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.product._id, parseInt(e.target.value))
                }
                className="w-16 p-1 border rounded"
                aria-label={`Cantidad de ${item.product.name}`}
              />
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                aria-label={`Eliminar ${item.product.name} del carrito`}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-right">
        <p className="text-xl font-bold mb-2">Total: ${total.toFixed(2)}</p>
        <button
          onClick={clearCart}
          className="bg-red-500 cursor-pointer text-white text-lg px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          aria-label="Vaciar carrito"
        >
          Vaciar Carrito
        </button>
        <Link
          href="/checkout"
          className="bg-green-500 cursor-pointer text-white text-lg px-3 py-[7px] rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          aria-label="Ir al checkout"
        >
          Ir al Checkout
        </Link>
      </div>
    </div>
  );
}
