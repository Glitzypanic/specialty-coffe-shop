// app/products/[id]/page.tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import { Product } from '@/types/product';

async function fetchProduct(id: string): Promise<Product | null> {
  await connectDB();
  const product = await ProductModel.findById(id);
  return product ? (product.toObject() as Product) : null;
}

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProduct(params.id);

  if (!product) {
    notFound();
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
