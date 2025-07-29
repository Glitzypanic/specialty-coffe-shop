// hooks/useCheckout.ts
import { useState, useCallback } from 'react';
import { useCart } from '@/components/ecommerce/CartContext';
import { useRouter } from 'next/navigation';
import { ContactInfo, ShippingAddress, BillingAddress } from '@/types/checkout';

/**
 * Estados del proceso de checkout
 */
export type CheckoutStep = 'contact' | 'shipping' | 'payment' | 'review';

/**
 * Datos completos del checkout
 */
export interface CheckoutData {
  contactInfo: ContactInfo;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  useSameAddress: boolean;
  selectedShipping: string;
  discountCode?: string;
}

/**
 * Hook para manejar el flujo de checkout
 */
export function useCheckout() {
  const { cart, clearCart, totalPrice } = useCart();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados para los formularios
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    number: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    apartment: '',
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    street: '',
    number: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    apartment: '',
    isBusiness: false,
    taxId: '',
    companyName: '',
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  /**
   * Validaciones para cada paso
   */
  const validateContactInfo = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!contactInfo.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (contactInfo.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!contactInfo.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      errors.email = 'El email no es válido';
    }

    if (!contactInfo.phone.trim()) {
      errors.phone = 'El teléfono es requerido';
    } else if (
      !/^[\d\s\-\+\(\)]{10,}$/.test(contactInfo.phone.replace(/\s/g, ''))
    ) {
      errors.phone = 'El teléfono debe tener al menos 10 dígitos';
    }

    return errors;
  }, [contactInfo]);

  const validateShippingAddress = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!shippingAddress.street.trim()) {
      errors.street = 'La dirección es requerida';
    } else if (shippingAddress.street.trim().length < 5) {
      errors.street = 'La dirección debe tener al menos 5 caracteres';
    }

    if (!shippingAddress.number.trim()) {
      errors.number = 'El número es requerido';
    }

    if (!shippingAddress.city.trim()) {
      errors.city = 'La ciudad es requerida';
    } else if (shippingAddress.city.trim().length < 2) {
      errors.city = 'La ciudad debe tener al menos 2 caracteres';
    }

    if (!shippingAddress.state.trim()) {
      errors.state = 'El estado es requerido';
    }

    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = 'El código postal es requerido';
    } else if (!/^\d{4,6}$/.test(shippingAddress.postalCode.trim())) {
      errors.postalCode = 'El código postal debe tener entre 4 y 6 dígitos';
    }

    if (!shippingAddress.country.trim()) {
      errors.country = 'El país es requerido';
    }

    return errors;
  }, [shippingAddress]);

  /**
   * Navegar al siguiente paso
   */
  const nextStep = useCallback(() => {
    const steps: CheckoutStep[] = ['contact', 'shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  /**
   * Navegar al paso anterior
   */
  const prevStep = useCallback(() => {
    const steps: CheckoutStep[] = ['contact', 'shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  /**
   * Procesar el pedido final
   */
  const processOrder = useCallback(async () => {
    setIsProcessing(true);

    try {
      const orderData = {
        cart,
        contactInfo,
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        selectedShipping,
        discountCode,
        total: totalPrice,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Error processing order');
      }

      const result = await response.json();

      // Limpiar carrito y redirigir
      await clearCart();
      router.push(`/orders/${result.orderId}?success=true`);
    } catch (error) {
      console.error('Error processing order:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [
    cart,
    contactInfo,
    shippingAddress,
    billingAddress,
    useSameAddress,
    selectedShipping,
    discountCode,
    totalPrice,
    clearCart,
    router,
  ]);

  return {
    // Estado
    currentStep,
    isProcessing,

    // Datos del formulario
    contactInfo,
    shippingAddress,
    billingAddress,
    useSameAddress,
    selectedShipping,
    discountCode,

    // Setters
    setContactInfo,
    setShippingAddress,
    setBillingAddress,
    setUseSameAddress,
    setSelectedShipping,
    setDiscountCode,
    setCurrentStep,

    // Validaciones
    validateContactInfo,
    validateShippingAddress,

    // Navegación
    nextStep,
    prevStep,

    // Procesamiento
    processOrder,
  };
}
