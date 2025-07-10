'use client';

import { ReactNode } from 'react';
import { CartProvider } from '../ecommerce/CartContext';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
