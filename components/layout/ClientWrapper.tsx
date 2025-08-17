'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/components/ecommerce/CartContext';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
