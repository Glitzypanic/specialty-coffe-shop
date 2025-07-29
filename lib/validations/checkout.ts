// lib/validations/checkout.ts
import { z } from 'zod';

/**
 * Esquema de validación para información de contacto
 */
export const ContactInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    ),

  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .max(100, 'El email no puede exceder 100 caracteres'),

  phone: z
    .string()
    .regex(
      /^[\d\s\-\+\(\)]{10,}$/,
      'El teléfono debe tener al menos 10 dígitos'
    )
    .transform((val) => val.replace(/\s/g, '')),
});

/**
 * Esquema de validación para dirección de envío
 */
export const ShippingAddressSchema = z.object({
  street: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(100, 'La dirección no puede exceder 100 caracteres'),

  number: z
    .string()
    .min(1, 'El número es requerido')
    .max(10, 'El número no puede exceder 10 caracteres'),

  apartment: z
    .string()
    .max(20, 'El apartamento no puede exceder 20 caracteres')
    .optional(),

  city: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(50, 'La ciudad no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'La ciudad solo puede contener letras y espacios'
    ),

  state: z
    .string()
    .min(2, 'El estado debe tener al menos 2 caracteres')
    .max(50, 'El estado no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El estado solo puede contener letras y espacios'
    ),

  postalCode: z
    .string()
    .regex(/^\d{4,6}$/, 'El código postal debe tener entre 4 y 6 dígitos'),

  country: z
    .string()
    .min(2, 'El país es requerido')
    .max(50, 'El país no puede exceder 50 caracteres'),
});

/**
 * Esquema de validación para dirección de facturación
 */
export const BillingAddressSchema = ShippingAddressSchema.extend({
  isBusiness: z.boolean().default(false),

  companyName: z
    .string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(100, 'La razón social no puede exceder 100 caracteres')
    .optional(),

  taxId: z
    .string()
    .regex(/^[A-Z0-9]{10,18}$/, 'Formato de RFC/Tax ID inválido')
    .optional(),
}).refine(
  (data) => {
    // Si es empresa, la razón social y RFC son obligatorios
    if (data.isBusiness) {
      return (
        data.companyName &&
        data.companyName.length >= 2 &&
        data.taxId &&
        data.taxId.length >= 10
      );
    }
    return true;
  },
  {
    message:
      'Para facturación empresarial, la razón social y RFC son obligatorios',
    path: ['companyName'],
  }
);

/**
 * Esquema de validación para opciones de envío
 */
export const ShippingOptionSchema = z.object({
  id: z.string().min(1, 'ID de opción de envío requerido'),
  name: z.string().min(1, 'Nombre de opción de envío requerido'),
  description: z.string().min(1, 'Descripción requerida'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  estimatedDays: z
    .number()
    .int()
    .min(1, 'Los días estimados deben ser al menos 1')
    .max(30, 'Los días estimados no pueden exceder 30'),
});

/**
 * Esquema de validación para código de descuento
 */
export const DiscountCodeSchema = z.object({
  code: z
    .string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(20, 'El código no puede exceder 20 caracteres')
    .regex(
      /^[A-Z0-9]+$/,
      'El código solo puede contener letras mayúsculas y números'
    ),
});

/**
 * Esquema de validación para información de pago
 */
export const PaymentInfoSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^[\d\s]{13,19}$/, 'Número de tarjeta inválido')
    .transform((val) => val.replace(/\s/g, '')), // Remover espacios

  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato de fecha inválido (MM/AA)')
    .refine((val) => {
      const [month, year] = val.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      return (
        year > currentYear || (year === currentYear && month >= currentMonth)
      );
    }, 'La tarjeta está vencida'),

  cvv: z.string().regex(/^\d{3,4}$/, 'CVV debe tener 3 o 4 dígitos'),

  cardholderName: z
    .string()
    .min(2, 'El nombre del titular debe tener al menos 2 caracteres')
    .max(100, 'El nombre del titular no puede exceder 100 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    ),
});

/**
 * Esquema completo de checkout
 */
export const CheckoutSchema = z.object({
  contactInfo: ContactInfoSchema,
  shippingAddress: ShippingAddressSchema,
  billingAddress: BillingAddressSchema,
  useSameAddress: z.boolean().default(true),
  selectedShipping: z.string().min(1, 'Opción de envío requerida'),
  discountCode: z.string().optional(),
  paymentInfo: PaymentInfoSchema,
});

/**
 * Esquema de validación para crear orden
 */
export const CreateOrderSchema = z.object({
  cart: z
    .array(
      z.object({
        product: z.object({
          _id: z.string().min(1, 'ID de producto requerido'),
          name: z.string().min(1, 'Nombre de producto requerido'),
          price: z.number().min(0, 'El precio no puede ser negativo'),
        }),
        quantity: z
          .number()
          .int()
          .min(1, 'La cantidad debe ser al menos 1')
          .max(999, 'La cantidad no puede exceder 999'),
      })
    )
    .min(1, 'El carrito no puede estar vacío'),

  contactInfo: ContactInfoSchema,
  shippingAddress: ShippingAddressSchema,
  billingAddress: BillingAddressSchema,
  selectedShipping: z.string().min(1, 'Opción de envío requerida'),
  discountCode: z.string().optional(),
  total: z.number().min(0, 'El total no puede ser negativo'),
});

/**
 * Tipos inferidos de los esquemas
 */
export type ContactInfoInput = z.infer<typeof ContactInfoSchema>;
export type ShippingAddressInput = z.infer<typeof ShippingAddressSchema>;
export type BillingAddressInput = z.infer<typeof BillingAddressSchema>;
export type ShippingOptionInput = z.infer<typeof ShippingOptionSchema>;
export type DiscountCodeInput = z.infer<typeof DiscountCodeSchema>;
export type PaymentInfoInput = z.infer<typeof PaymentInfoSchema>;
export type CheckoutInput = z.infer<typeof CheckoutSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
