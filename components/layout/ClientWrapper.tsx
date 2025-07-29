// components/layout/ClientWrapper.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/components/ecommerce/CartContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
