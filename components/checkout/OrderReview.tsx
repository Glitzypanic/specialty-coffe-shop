// components/checkout/OrderReview.tsx
import { CheckoutFormData, OrderSummary } from '@/types/checkout';
import OrderSummaryComponent from './OrderSummary';

interface OrderReviewProps {
  formData: CheckoutFormData;
  orderSummary: OrderSummary;
  onConfirm: () => void;
  isProcessing: boolean;
}

export default function OrderReview({
  formData,
  orderSummary,
  onConfirm,
  isProcessing,
}: OrderReviewProps) {
  const { contactInfo, shippingAddress, billingAddress, useSameAddress } =
    formData;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-coffee mb-4">Revisar Pedido</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información de contacto y direcciones */}
        <div className="space-y-6">
          {/* Contacto */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Información de Contacto
            </h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Nombre:</span>{' '}
                {contactInfo.name}
              </p>
              <p>
                <span className="text-gray-600">Email:</span>{' '}
                {contactInfo.email}
              </p>
              <p>
                <span className="text-gray-600">Teléfono:</span>{' '}
                {contactInfo.phone}
              </p>
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Dirección de Envío
            </h4>
            <div className="text-sm text-gray-700">
              <p>
                {shippingAddress.street} {shippingAddress.number}
              </p>
              {shippingAddress.apartment && (
                <p>Apt. {shippingAddress.apartment}</p>
              )}
              <p>
                {shippingAddress.city}, {shippingAddress.state}
              </p>
              <p>
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Dirección de facturación */}
          {!useSameAddress && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Dirección de Facturación
              </h4>
              {billingAddress.isBusiness && billingAddress.companyName && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Empresa:</span>{' '}
                  {billingAddress.companyName}
                </p>
              )}
              <div className="text-sm text-gray-700">
                <p>
                  {billingAddress.street} {billingAddress.number}
                </p>
                {billingAddress.apartment && (
                  <p>Apt. {billingAddress.apartment}</p>
                )}
                <p>
                  {billingAddress.city}, {billingAddress.state}
                </p>
                <p>
                  {billingAddress.postalCode}, {billingAddress.country}
                </p>
                {billingAddress.taxId && (
                  <p className="mt-2">
                    <span className="font-medium">RFC/Tax ID:</span>{' '}
                    {billingAddress.taxId}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Resumen del pedido */}
        <div>
          <OrderSummaryComponent
            orderSummary={orderSummary}
            isEditable={false}
          />
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            required
            className="mt-1 h-4 w-4 text-coffee focus:ring-coffee border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            Acepto los{' '}
            <a href="#" className="text-coffee hover:underline">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="#" className="text-coffee hover:underline">
              política de privacidad
            </a>
          </span>
        </label>
      </div>

      {/* Botón de confirmación */}
      <button
        onClick={onConfirm}
        disabled={isProcessing}
        className="w-full bg-coffee text-white py-3 px-4 rounded-md font-medium hover:bg-coffee/90 focus:outline-none focus:ring-2 focus:ring-coffee focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Procesando pedido...
          </div>
        ) : (
          `Confirmar Pedido - $${orderSummary.total.toFixed(2)}`
        )}
      </button>
    </div>
  );
}
