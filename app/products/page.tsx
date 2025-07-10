// app/products/page.tsx
import ProductCard from '@/components/ecommerce/ProductCard';
import { Product } from '@/types/product';

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-coffee mb-6">
        Nuestros Productos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}
