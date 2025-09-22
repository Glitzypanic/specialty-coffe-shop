// app/products/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useCart } from '@/components/ecommerce/CartContext';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { addToCart } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Función para recuperar el producto desde la base de datos
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        router.push('/404'); // Redirige a una página 404 si el producto no existe
      }
    };

    fetchProduct();
  }, [id, router]);

  if (!product) {
    return <p>Cargando...</p>; // Muestra un mensaje de carga mientras se recupera el producto
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-coffee mb-6">{product.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-96">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-lg text-gray-600">{product.description}</p>
          <p className="text-2xl font-bold text-green-600 mt-4">
            ${product.price}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Categoría: {product.category}
          </p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          <button
            onClick={() => addToCart(product)}
            className="mt-6 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            aria-label={`Añadir ${product.name} al carrito`}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
