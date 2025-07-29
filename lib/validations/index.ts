// lib/validations/index.ts
import { ZodSchema, ZodError, ZodIssue } from 'zod';

// Exportaciones de validaciones de carrito
export * from './cart';

// Exportaciones de validaciones de usuario
export * from './user';

// Exportaciones de validaciones de checkout
export * from './checkout';

// Re-exportación de utilidades comunes
export { z } from 'zod';

/**
 * Utility function para validar datos de forma consistente
 */
export function validateData<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Validation error: ${error.issues
          .map((e: ZodIssue) => e.message)
          .join(', ')}`
      );
    }
    throw error;
  }
}
