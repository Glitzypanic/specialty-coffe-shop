// components/common/FormInput.tsx
import React, { forwardRef, InputHTMLAttributes } from 'react';

/**
 * Props para el componente FormInput
 */
export interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

/**
 * Componente optimizado para inputs de formularios
 * Incluye etiqueta, mensaje de error y estilos consistentes
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helpText,
      required = false,
      onChange,
      containerClassName = '',
      labelClassName = '',
      inputClassName = '',
      errorClassName = '',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    const defaultInputClasses = [
      'w-full px-3 py-2 border rounded-md',
      'focus:outline-none focus:ring-2 focus:ring-coffee',
      'placeholder-gray-500 text-gray-800',
      'disabled:bg-gray-100 disabled:cursor-not-allowed',
      hasError ? 'border-red-500' : 'border-gray-300',
      'transition-colors duration-200',
    ].join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`space-y-1 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          onChange={handleChange}
          className={`${defaultInputClasses} ${inputClassName} ${
            className || ''
          }`}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helpText
              ? `${inputId}-help`
              : undefined
          }
          {...props}
        />

        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-sm text-gray-600">
            {helpText}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            className={`text-sm text-red-600 ${errorClassName}`}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
