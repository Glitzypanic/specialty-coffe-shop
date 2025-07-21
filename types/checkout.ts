// types/checkout.ts
export interface ShippingAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  apartment?: string;
}

export interface BillingAddress extends ShippingAddress {
  taxId?: string;
  companyName?: string;
  isBusiness: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface DiscountCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  isValid: boolean;
}

export interface CheckoutFormData {
  contactInfo: ContactInfo;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  useSameAddress: boolean;
  selectedShipping: string;
  discountCode?: string;
}

export type CheckoutStep = 'contact' | 'shipping' | 'payment' | 'review';

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}
