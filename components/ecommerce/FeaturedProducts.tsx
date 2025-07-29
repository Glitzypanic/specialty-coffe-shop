'use client';

import dynamic from 'next/dynamic';
import { Product } from '@/types/product';

interface FeaturedProductsProps {
  products: Product[];
}

// Componente que se renderiza solo en el cliente para evitar hydration mismatch
const ClientOnlyFeaturedProducts = dynamic(
  () => import('./FeaturedProductsClient'),
  {
    ssr: false,
    loading: () => (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-coffee mb-4">
              Productos Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección especial de cafés de especialidad y
              accesorios seleccionados cuidadosamente para ti.
            </p>
          </div>
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-gray-200 bg-white rounded-lg shadow-md animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-b-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return <ClientOnlyFeaturedProducts products={products} />;
}
