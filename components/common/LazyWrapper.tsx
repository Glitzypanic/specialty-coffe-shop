// components/common/LazyWrapper.tsx
import React, { Suspense, ComponentType } from 'react';
import dynamic from 'next/dynamic';

/**
 * Props para el wrapper de lazy loading
 */
interface LazyWrapperProps {
  fallback?: React.ReactNode;
  ssr?: boolean;
}

/**
 * Skeleton loader genérico
 */
const DefaultSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

/**
 * HOC para envolver componentes con lazy loading
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  options: LazyWrapperProps = {}
) {
  const { fallback = <DefaultSkeleton />, ssr = false } = options;

  const LazyComponent = dynamic(() => Promise.resolve(Component), {
    loading: () => <>{fallback}</>,
    ssr,
  });

  const WrappedComponent = (props: P) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `withLazyLoading(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

/**
 * Skeleton específico para productos
 */
export const ProductSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

/**
 * Skeleton para carrito
 */
export const CartSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded">
        <div className="h-12 w-12 bg-gray-200 rounded"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    ))}
  </div>
);
