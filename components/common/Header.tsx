// components/common/Header.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/components/ecommerce/CartContext';
import { signOut, signIn } from 'next-auth/react';

export default function Header({ session }: { session: any }) {
  const { cart } = useCart();
  const isAuthenticated = session?.user ? true : false;

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
          <li>
            {isAuthenticated ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hover:underline text-cream"
                aria-label="Cerrar sesión"
              >
                Cerrar Sesión
              </button>
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
