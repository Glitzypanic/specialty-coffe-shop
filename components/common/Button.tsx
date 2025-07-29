// components/common/Button.tsx
import React, { ButtonHTMLAttributes, forwardRef } from 'react';

/**
 * Variantes de botón disponibles
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';

/**
 * Tamaños de botón disponibles
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props para el componente Button
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Componente Button optimizado y reutilizable
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Cargando...',
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variantClasses = {
      primary: [
        'bg-coffee text-white',
        'hover:bg-coffee/90',
        'focus:ring-coffee',
      ],
      secondary: [
        'bg-gray-600 text-white',
        'hover:bg-gray-700',
        'focus:ring-gray-500',
      ],
      outline: [
        'bg-transparent text-coffee border border-coffee',
        'hover:bg-coffee hover:text-white',
        'focus:ring-coffee',
      ],
      ghost: [
        'bg-transparent text-coffee',
        'hover:bg-coffee/10',
        'focus:ring-coffee',
      ],
      danger: [
        'bg-red-600 text-white',
        'hover:bg-red-700',
        'focus:ring-red-500',
      ],
    };

    const sizeClasses = {
      sm: ['px-3 py-1.5 text-sm'],
      md: ['px-4 py-2 text-base'],
      lg: ['px-6 py-3 text-lg'],
    };

    const widthClasses = fullWidth ? ['w-full'] : [];

    const allClasses = [
      ...baseClasses,
      ...variantClasses[variant],
      ...sizeClasses[size],
      ...widthClasses,
      className,
    ].join(' ');

    const isDisabled = disabled || isLoading;

    return (
      <button ref={ref} disabled={isDisabled} className={allClasses} {...props}>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}

        {isLoading ? loadingText : children}

        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
