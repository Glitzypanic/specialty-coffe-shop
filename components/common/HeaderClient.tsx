'use client';

import Link from 'next/link';
import { useCart } from '@/components/ecommerce/CartContext';
import { useSession } from 'next-auth/react';
import { FaUser, FaShoppingCart } from 'react-icons/fa';

/**
 * Componente Header del lado del cliente
 * Maneja la navegación, autenticación y estado del carrito
 */

export default function HeaderClient() {
  const { totalItems } = useCart();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const isAuthenticated = session?.user ? true : false;

  if (loading) {
    return null; // O un spinner de carga
  }

  return (
    <header className="bg-white text-cream p-4 sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold" aria-label="Inicio">
          Code & Brew
        </Link>
        <div className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline" aria-label="Inicio">
                Inicio
              </Link>
            </li>
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
              <Link
                href="/blog"
                className="hover:underline"
                aria-label="Sobre Nosotros"
              >
                Sobre Nosotros
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link
                href={isAuthenticated ? '/profile' : '/auth/signin'}
                aria-label="Mi cuenta"
              >
                <FaUser size={20} />
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="text-cream flex items-center"
                aria-label="Carrito"
              >
                <FaShoppingCart size={20} />
                <span className="ml-1">{totalItems}</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
