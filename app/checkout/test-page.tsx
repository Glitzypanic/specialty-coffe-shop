'use client';

import { useCart } from '@/components/ecommerce/CartContext';

export default function TestCheckoutPage() {
  const { cart } = useCart();

  console.log('Cart in checkout:', cart);

  if (cart.length === 0) {
    return (
      <main className="container mx-auto p-4">
        <h1>Carrito Vacío</h1>
        <p>No tienes productos en tu carrito.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1>Test Checkout Page</h1>
      <p>Items en el carrito: {cart.length}</p>
      {cart.map((item) => (
        <div key={item.product._id}>
          <p>
            {item.product.name} - Cantidad: {item.quantity}
          </p>
        </div>
      ))}
    </main>
  );
}
