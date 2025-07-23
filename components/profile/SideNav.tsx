'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function SideNav() {
  return (
    <nav className="flex flex-col h-full py-8 gap-4 bg-black text-white">
      <Link
        href="/profile"
        className="font-semibold text-lg hover:text-blue-600"
      >
        Mi cuenta
      </Link>
      <Link
        href="/profile?section=orders"
        className="font-semibold text-lg hover:text-blue-600"
      >
        Historial de compras
      </Link>
      <div className="flex-grow" />
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="w-full flex items-center gap-2 p-2 rounded bg-red-100 hover:bg-red-200 text-red-700 font-semibold"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}
