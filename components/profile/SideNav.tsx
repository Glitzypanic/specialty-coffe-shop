'use client';

import React from 'react';
import useMounted from '@/hooks/useMounted';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const pathname = usePathname();
  const mounted = useMounted();

  const isActive = (path: string) => {
    if (!mounted) return false; // prevent relying on pathname during SSR
    if (path === '/profile') {
      return pathname === '/profile';
    }
    return pathname === path;
  };

  const getLinkStyles = (path: string) => {
    const baseStyles = 'font-semibold text-lg px-4 py-2 rounded-lg outline';
    if (isActive(path)) {
      return `${baseStyles} font-bold`;
    }
    return `${baseStyles} text-gray-400 hover:text-black`;
  };

  return (
    <nav className="flex flex-col h-full py-8 px-8 gap-4">
      <Link href="/profile" className={getLinkStyles('/profile')}>
        Mi cuenta
      </Link>
      <Link href="/profile/orders" className={getLinkStyles('/profile/orders')}>
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
