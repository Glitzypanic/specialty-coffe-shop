'use client';

import { Product } from '@/types/product';
import ProductCardClient from './ProductCardClient';

interface FeaturedProductsClientProps {
  products: Product[];
}

export default function FeaturedProductsClient({
  products,
}: FeaturedProductsClientProps) {
  // Limit to 4 products maximum
  const featuredProducts = products.slice(0, 4);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-coffee dark:text-cream mb-4">
            Productos Destacados
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre nuestra selección especial de cafés de especialidad y
            accesorios seleccionados cuidadosamente para ti.
          </p>
        </div>

        {/* Responsive grid - no carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCardClient key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
