// components/index.ts

// Common components
export { Button } from './common/Button';
export { FormInput } from './common/FormInput';
export {
  withLazyLoading,
  ProductSkeleton,
  CartSkeleton,
} from './common/LazyWrapper';
export { default as HeaderClient } from './common/HeaderClient';
export { default as Footer } from './common/Footer';

// E-commerce components
export { CartProvider, useCart } from './ecommerce/CartContext';
export { default as Cart } from './ecommerce/Cart';
export { default as ProductCard } from './ecommerce/ProductCard';

// Checkout components
export { default as ContactForm } from './checkout/ContactForm';
export { default as AddressForm } from './checkout/AddressForm';
export { default as PaymentForm } from './checkout/PaymentForm';
export { default as ShippingOptions } from './checkout/ShippingOptions';
export { default as OrderReview } from './checkout/OrderReview';
export { default as OrderSummary } from './checkout/OrderSummary';
export { default as CheckoutProgress } from './checkout/CheckoutProgress';

// Layout components
export { default as ClientWrapper } from './layout/ClientWrapper';
