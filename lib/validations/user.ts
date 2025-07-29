// lib/validations/user.ts
import { z } from 'zod';

/**
 * Esquema de validación para registro de usuario
 */
export const UserRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    ),

  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .max(100, 'El email no puede exceder 100 caracteres'),

  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una minúscula, una mayúscula y un número'
    ),

  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]{10,}$/, 'Formato de teléfono inválido')
    .transform((val) => val.replace(/\s/g, '')), // Remover espacios
});

/**
 * Esquema de validación para login
 */
export const UserLoginSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),

  password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Esquema de validación para actualización de perfil
 */
export const UserUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    )
    .optional(),

  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]{10,}$/, 'Formato de teléfono inválido')
    .transform((val) => val.replace(/\s/g, ''))
    .optional(),
});

/**
 * Esquema de validación para cambio de contraseña
 */
export const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),

    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña no puede exceder 100 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una minúscula, una mayúscula y un número'
      ),

    confirmPassword: z
      .string()
      .min(1, 'La confirmación de contraseña es requerida'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Tipos inferidos de los esquemas
 */
export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>;
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof PasswordChangeSchema>;
