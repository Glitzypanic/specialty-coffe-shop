'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartContext';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

// Placeholder component for missing images
const ProductImagePlaceholder = ({ name }: { name: string }) => (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
    <div className="text-center text-gray-500">
      <svg
        className="mx-auto h-12 w-12 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p className="text-xs">{name}</p>
    </div>
  </div>
);

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="border border-gray-200 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <Link
        href={`/products/${product._id}`}
        aria-label={`Ver detalles de ${product.name}`}
      >
        <div className="relative h-48 w-full">
          {product.image && !product.image.includes('/images/') ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={(e) => {
                // Hide broken image
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <ProductImagePlaceholder name={product.name} />
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h2>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-lg font-bold text-green-600 mt-2">
            ${product.price}
          </p>
        </div>
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="w-full bg-coffee text-white py-2 rounded-b-md hover:bg-coffee/90 focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-opacity-50 transition-colors duration-200"
        aria-label={`Añadir ${product.name} al carrito`}
      >
        Añadir al carrito
      </button>
    </article>
  );
}
