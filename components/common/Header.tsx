// components/common/Header.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/components/ecommerce/CartContext';
import { signIn } from 'next-auth/react';

interface SessionUser {
  name?: string;
  email?: string;
  image?: string;
  id?: string;
}

interface Session {
  user?: SessionUser;
}

export default function Header({ session }: { session: Session }) {
  const { cart } = useCart();
  const isAuthenticated = session?.user ? true : false;

  return (
    <header className="bg-coffee text-cream p-4 transition-colors duration-300">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold" aria-label="Inicio">
          Coffee Shop
        </Link>

        <div className="flex items-center space-x-4">
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
              <Link
                href="/cart"
                className="hover:underline"
                aria-label="Carrito"
              >
                Carrito ({cart.length})
              </Link>
            </li>
            <li>
              {isAuthenticated ? (
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
        </div>
      </nav>
    </header>
  );
}
