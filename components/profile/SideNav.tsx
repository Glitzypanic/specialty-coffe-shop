'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/profile') {
      return pathname === '/profile';
    }
    return pathname === path;
  };

  const getLinkStyles = (path: string) => {
    const baseStyles =
      'font-semibold text-lg transition-colors duration-200 px-4 py-2 rounded-lg';
    if (isActive(path)) {
      return `${baseStyles} p-2 bg-green text-white`;
    }
    return `${baseStyles} text-gray-700 hover:text-coffee hover:bg-gray-100`;
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
