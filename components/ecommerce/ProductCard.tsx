'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartContext';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="border rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <Link
        href={`/products/${product._id}`}
        aria-label={`Ver detalles de ${product.name}`}
      >
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
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
        className="w-full bg-green-500 text-white py-2 rounded-b-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        aria-label={`Añadir ${product.name} al carrito`}
      >
        Añadir al carrito
      </button>
    </article>
  );
}
