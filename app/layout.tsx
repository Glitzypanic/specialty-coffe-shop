// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ClientWrapper from '@/components/layout/ClientWrapper';

export const metadata: Metadata = {
  title: 'Coffee Shop',
  description: 'Tienda de café de especialidad y accesorios',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <ClientWrapper>
          <Header />
          {children}
        </ClientWrapper>
        <Footer />
      </body>
    </html>
  );
}
