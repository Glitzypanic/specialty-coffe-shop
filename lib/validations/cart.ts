// lib/validations/cart.ts
import { z } from 'zod';

/**
 * Esquema de validación para un item del carrito
 */
export const CartItemSchema = z.object({
  product: z.union([
    z.string().min(1, 'Product ID is required'),
    z.object({
      _id: z.string().min(1, 'Product ID is required'),
    }),
  ]),
  quantity: z
    .number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(999, 'Quantity cannot exceed 999'),
});

/**
 * Esquema de validación para el carrito completo
 */
export const CartSchema = z.object({
  cart: z.array(CartItemSchema).max(50, 'Cart cannot have more than 50 items'),
});

/**
 * Tipos inferidos de los esquemas
 */
export type CartItemInput = z.infer<typeof CartItemSchema>;
export type CartInput = z.infer<typeof CartSchema>;

/**
 * Errores de API estandarizados
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Códigos de error específicos para el carrito
 */
export const CartErrorCodes = {
  UNAUTHORIZED: 'CART_UNAUTHORIZED',
  USER_NOT_FOUND: 'CART_USER_NOT_FOUND',
  INVALID_PRODUCT: 'CART_INVALID_PRODUCT',
  PRODUCT_NOT_FOUND: 'CART_PRODUCT_NOT_FOUND',
  VALIDATION_ERROR: 'CART_VALIDATION_ERROR',
  DATABASE_ERROR: 'CART_DATABASE_ERROR',
} as const;
