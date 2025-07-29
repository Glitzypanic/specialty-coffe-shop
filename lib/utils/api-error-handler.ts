// lib/utils/api-error-handler.ts
import { NextResponse } from 'next/server';
import { ApiError } from '@/lib/validations/cart';
import { ZodError } from 'zod';
import { Session } from 'next-auth';

/**
 * Tipo para respuestas de error estandarizadas
 */
export interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, unknown> | unknown[];
  timestamp: string;
}

/**
 * Maneja errores de API y devuelve respuestas estandarizadas
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString();

  // Error personalizado de API
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        timestamp,
      },
      { status: error.statusCode }
    );
  }

  // Error de validación de Zod
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.issues,
        timestamp,
      },
      { status: 400 }
    );
  }

  // Error de base de datos (MongoDB)
  if (error instanceof Error && error.name === 'MongoError') {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Database operation failed',
        code: 'DATABASE_ERROR',
        timestamp,
      },
      { status: 500 }
    );
  }

  // Error genérico
  console.error('Unexpected error:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp,
    },
    { status: 500 }
  );
}

/**
 * Valida que el usuario esté autenticado
 */
export function validateAuthentication(session: Session | null): void {
  if (!session?.user?.email) {
    throw new ApiError(401, 'Authentication required', 'UNAUTHORIZED');
  }
}
