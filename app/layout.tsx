// app/layout.tsx
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import HeaderClient from '@/components/common/HeaderClient';
import Footer from '@/components/common/Footer';
import ClientWrapper from '@/components/layout/ClientWrapper';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Coffee Shop',
  description: 'Tienda de café de especialidad y accesorios',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <ClientWrapper>
          <Suspense
            fallback={
              <div className="bg-coffee text-cream p-4">Cargando header...</div>
            }
          >
            <HeaderClient />
          </Suspense>
          {children}
        </ClientWrapper>
        <Footer />
      </body>
    </html>
  );
}
