// app/page.tsx
import Link from 'next/link';
import FeaturedProducts from '@/components/ecommerce/FeaturedProducts';
import { Product } from '@/types/product';

function getSampleProducts(): Product[] {
  return [
    {
      _id: '1',
      name: 'Café Colombiano Premium',
      description: 'Café de altura con notas frutales y chocolate',
      price: 25.99,
      image: '/images/coffee1.jpg',
      category: 'cafe',
      stock: 10,
    },
    {
      _id: '2',
      name: 'Espresso Italiano',
      description: 'Mezcla perfecta para espresso con cuerpo intenso',
      price: 22.5,
      image: '/images/coffee2.jpg',
      category: 'cafe',
      stock: 15,
    },
    {
      _id: '3',
      name: 'Cold Brew Special',
      description: 'Café especial para preparación en frío',
      price: 28.75,
      image: '/images/coffee3.jpg',
      category: 'cafe',
      stock: 8,
    },
    {
      _id: '4',
      name: 'Café Guatemalteco',
      description: 'Café de origen único con notas cítricas',
      price: 24.0,
      image: '/images/coffee4.jpg',
      category: 'cafe',
      stock: 12,
    },
    {
      _id: '5',
      name: 'Molinillo Profesional',
      description: 'Molinillo de café con ajuste de molienda',
      price: 89.99,
      image: '/images/grinder.jpg',
      category: 'accesorios',
      stock: 5,
    },
    {
      _id: '6',
      name: 'Cafetera French Press',
      description: 'Cafetera de émbolo para café aromático',
      price: 45.5,
      image: '/images/french-press.jpg',
      category: 'accesorios',
      stock: 7,
    },
  ];
}

export default function Home() {
  const featuredProducts = getSampleProducts();

  return (
    <main className="container mx-auto p-4">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-sky-900">
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

      <FeaturedProducts products={featuredProducts} />
    </main>
  );
}
