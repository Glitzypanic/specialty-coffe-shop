'use client';

import Link from 'next/link';
import { useCart } from '@/components/ecommerce/CartContext';

export default function Header() {
  const { cart } = useCart();

  return (
    <header className="bg-coffee text-cream p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold" aria-label="Inicio">
          Coffee Shop
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/products"
              className="hover:underline"
              aria-label="Productos"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link href="/cart" className="hover:underline" aria-label="Carrito">
              Carrito ({cart.length})
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
