'use client'; // Sin espacios ni comentarios antes de esta línea

import Link from 'next/link';
import { useCart } from '@/components/ecommerce/CartContext';
import { signIn, useSession } from 'next-auth/react';

export default function HeaderClient() {
  const { data: session, status } = useSession();
  const { cart } = useCart();
  const loading = status === 'loading';
  const isAuthenticated = session?.user ? true : false;

  // Calcular el total de cantidades
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

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
              Carrito ({totalItems})
            </Link>
          </li>
          <li>
            {loading ? (
              <span>Cargando...</span>
            ) : isAuthenticated ? (
              <Link
                href="/profile"
                className="hover:underline text-cream"
                aria-label="Mi cuenta"
              >
                Mi cuenta
              </Link>
            ) : (
              <>
                <button
                  onClick={() => signIn()}
                  className="hover:underline text-cream mr-2"
                  aria-label="Iniciar sesión"
                >
                  Iniciar Sesión
                </button>
                <Link
                  href="/auth/signup"
                  className="hover:underline text-cream"
                >
                  Registrarse
                </Link>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
