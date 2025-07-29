// hooks/useFormValidation.ts
import { useState, useCallback, useMemo } from 'react';

/**
 * Tipo genérico para reglas de validación
 */
export type ValidationRule<T> = {
  [K in keyof T]?: (value: T[K]) => string | undefined;
};

/**
 * Resultado de la validación
 */
export interface ValidationResult<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
}

/**
 * Hook para manejo de validación de formularios
 */
export function useFormValidation<T extends Record<string, unknown>>(
  initialData: T,
  validationRules: ValidationRule<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  /**
   * Actualiza un campo específico
   */
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));

      // Limpiar error del campo al empezar a escribir
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Marca un campo como tocado
   */
  const touchField = useCallback(<K extends keyof T>(field: K) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  /**
   * Valida un campo específico
   */
  const validateField = useCallback(
    <K extends keyof T>(field: K): string | undefined => {
      const rule = validationRules[field];
      if (!rule) return undefined;

      return rule(data[field]);
    },
    [data, validationRules]
  );

  /**
   * Valida todos los campos
   */
  const validateAll = useCallback((): ValidationResult<T> => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    // Marcar todos los campos como tocados
    const allTouched = Object.keys(data).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {} as Partial<Record<keyof T, boolean>>
    );
    setTouched(allTouched);

    // Validar cada campo
    Object.keys(validationRules).forEach((key) => {
      const field = key as keyof T;
      const error = validateField(field);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  }, [data, validateField, validationRules]);

  /**
   * Resetea el formulario
   */
  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  /**
   * Indica si el formulario es válido actualmente
   */
  const isValid = useMemo(() => {
    return Object.keys(validationRules).every((key) => {
      const field = key as keyof T;
      return !validateField(field);
    });
  }, [validateField, validationRules]);

  return {
    data,
    errors,
    touched,
    isValid,
    updateField,
    touchField,
    validateField,
    validateAll,
    reset,
  };
}
