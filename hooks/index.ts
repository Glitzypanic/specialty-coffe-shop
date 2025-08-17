// hooks/index.ts

// Form and validation hooks
export { useFormValidation } from './useFormValidation';

// Checkout hooks
export { useCheckout } from './useCheckout';

// Performance hooks
export { useDebounce, useDebouncedCallback } from './useDebounce';

// Re-export commonly used React hooks for convenience
export {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';

// Export useMounted helper
export { default as useMounted } from './useMounted';
