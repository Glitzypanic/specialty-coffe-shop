// components/ecommerce/CartContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useSession } from 'next-auth/react';
import { Product } from '@/types/product';

/**
 * Representa un item en el carrito de compras
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Tipo del contexto del carrito
 */
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Proveedor del contexto del carrito de compras
 * Maneja la sincronización entre localStorage y servidor según el estado de autenticación
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { status } = useSession();

  // Valores calculados usando useMemo para evitar re-cálculos innecesarios
  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    [cart]
  );

  // Cargar carrito desde localStorage
  const loadLocalCart = useCallback(() => {
    try {
      const localCart = localStorage.getItem('cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error('Error loading local cart:', error);
      return [];
    }
  }, []);

  // Guardar carrito en localStorage
  const saveLocalCart = useCallback((cartData: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  }, []);

  // Cargar carrito desde la API (usuarios autenticados)
  const loadServerCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) {
        throw new Error('Failed to load cart');
      }
      const data = await res.json();
      return data.cart || [];
    } catch (error) {
      console.error('Error loading server cart:', error);
      return [];
    }
  }, []);

  // Migrar y combinar carrito local con el del servidor
  const migrateCartToServer = useCallback(
    async (localCart: CartItem[]) => {
      try {
        if (localCart.length === 0) {
          // Si no hay carrito local, solo cargar del servidor
          return await loadServerCart();
        }

        // Obtener el carrito existente del servidor
        const serverCart = await loadServerCart();

        // Crear un mapa para facilitar la combinación
        const cartMap = new Map<string, CartItem>();

        // Agregar items del servidor al mapa
        serverCart.forEach((item: CartItem) => {
          cartMap.set(item.product._id, item);
        });

        // Combinar o agregar items del carrito local
        localCart.forEach((localItem: CartItem) => {
          const existingItem = cartMap.get(localItem.product._id);
          if (existingItem) {
            // Producto ya existe, sumar cantidades
            cartMap.set(localItem.product._id, {
              ...existingItem,
              quantity: existingItem.quantity + localItem.quantity,
            });
          } else {
            // Producto nuevo, agregarlo
            cartMap.set(localItem.product._id, localItem);
          }
        });

        const combinedCart = Array.from(cartMap.values());

        // Guardar el carrito combinado en el servidor
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: combinedCart }),
        });

        // Limpiar localStorage después de migrar
        localStorage.removeItem('cart');

        return combinedCart;
      } catch (error) {
        console.error('Error migrating cart to server:', error);
        // En caso de error, al menos retornar el carrito del servidor
        return await loadServerCart();
      }
    },
    [loadServerCart]
  );

  // Efecto principal para manejar la carga del carrito
  useEffect(() => {
    const initializeCart = async () => {
      if (status === 'loading') return;

      setIsLoading(true);
      try {
        if (status === 'authenticated') {
          // Usuario autenticado
          const localCart = loadLocalCart();
          // Migrar y combinar carritos
          const finalCart = await migrateCartToServer(localCart);
          setCart(finalCart);
        } else {
          // Usuario no autenticado - usar localStorage
          const localCart = loadLocalCart();
          setCart(localCart);
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
        // En caso de error, usar localStorage como fallback
        const localCart = loadLocalCart();
        setCart(localCart);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCart();
  }, [status, loadLocalCart, migrateCartToServer]);

  // Guardar carrito (servidor o localStorage según el estado de autenticación)
  const saveCart = useCallback(
    async (newCart: CartItem[]) => {
      try {
        if (status === 'authenticated') {
          // Guardar en servidor
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: newCart }),
          });
        } else {
          // Guardar en localStorage
          saveLocalCart(newCart);
        }
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    },
    [status, saveLocalCart]
  );

  /**
   * Validar si un producto es válido
   */
  const isValidProduct = useCallback((product: Product): boolean => {
    return !!(
      product &&
      product._id &&
      typeof product._id === 'string' &&
      product.name &&
      typeof product.price === 'number' &&
      product.price > 0
    );
  }, []);

  const addToCart = useCallback(
    (product: Product) => {
      if (!isValidProduct(product)) {
        console.error('Invalid product:', product);
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product._id === product._id
        );
        const newCart = existingItem
          ? prevCart.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevCart, { product, quantity: 1 }];

        saveCart(newCart);
        return newCart;
      });
    },
    [saveCart, isValidProduct]
  );

  /**
   * Validar si un ID de producto es válido
   */
  const isValidProductId = useCallback((productId: string): boolean => {
    return !!(
      productId &&
      typeof productId === 'string' &&
      productId.trim().length > 0
    );
  }, []);

  const removeFromCart = useCallback(
    (productId: string) => {
      if (!isValidProductId(productId)) {
        console.error('Invalid productId:', productId);
        return;
      }

      setCart((prevCart) => {
        const newCart = prevCart.filter(
          (item) => item.product._id !== productId
        );
        saveCart(newCart);
        return newCart;
      });
    },
    [saveCart, isValidProductId]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (
        !isValidProductId(productId) ||
        quantity < 1 ||
        !Number.isInteger(quantity)
      ) {
        console.error('Invalid parameters:', { productId, quantity });
        return;
      }

      setCart((prevCart) => {
        const newCart = prevCart.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        );
        saveCart(newCart);
        return newCart;
      });
    },
    [saveCart, isValidProductId]
  );

  /**
   * Limpiar todo el carrito
   */
  const clearCart = useCallback(async () => {
    setCart([]);
    try {
      if (status === 'authenticated') {
        await saveCart([]);
      } else {
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [saveCart, status]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
