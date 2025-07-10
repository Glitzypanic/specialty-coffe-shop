// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-coffee">
          Bienvenido a Coffee Shop
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Descubre los mejores cafés de especialidad y accesorios.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block bg-coffee text-cream py-2 px-4 rounded-md hover:bg-coffee/80 focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50"
          aria-label="Ver productos"
        >
          Ver Productos
        </Link>
      </section>
    </main>
  );
}
