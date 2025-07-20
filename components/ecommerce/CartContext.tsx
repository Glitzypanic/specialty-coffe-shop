// components/ecommerce/CartContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useSession } from 'next-auth/react';
import { Product } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: session, status } = useSession();

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
        if (localCart.length > 0) {
          // Primero obtener el carrito existente del servidor
          const serverCart = await loadServerCart();

          // Combinar carritos
          const combinedCart = [...serverCart];

          localCart.forEach((localItem) => {
            const existingIndex = combinedCart.findIndex(
              (serverItem) => serverItem.product._id === localItem.product._id
            );

            if (existingIndex !== -1) {
              // Producto ya existe, sumar cantidades
              combinedCart[existingIndex].quantity += localItem.quantity;
            } else {
              // Producto nuevo, agregarlo
              combinedCart.push(localItem);
            }
          });

          // Guardar el carrito combinado en el servidor
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: combinedCart }),
          });

          // Limpiar localStorage después de migrar
          localStorage.removeItem('cart');

          // Retornar el carrito combinado
          return combinedCart;
        }

        // Si no hay carrito local, solo cargar del servidor
        return await loadServerCart();
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

  const addToCart = useCallback(
    (product: Product) => {
      if (!product || !product._id || typeof product._id !== 'string') {
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
    [saveCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      if (!productId || typeof productId !== 'string') {
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
    [saveCart]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (!productId || typeof productId !== 'string' || quantity < 1) {
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
    [saveCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    if (status === 'authenticated') {
      saveCart([]);
    } else {
      localStorage.removeItem('cart');
    }
  }, [saveCart, status]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
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
