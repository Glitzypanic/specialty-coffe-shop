// components/checkout/ShippingOptions.tsx
import { ShippingOption } from '@/types/checkout';

interface ShippingOptionsProps {
  options: ShippingOption[];
  selectedOption: string;
  onSelect: (optionId: string) => void;
}

export default function ShippingOptions({
  options,
  selectedOption,
  onSelect,
}: ShippingOptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-coffee mb-4">
        Opciones de Envío
      </h3>

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className={`block p-4 border rounded-lg cursor-pointer transition-colors
              ${
                selectedOption === option.id
                  ? 'border-coffee bg-coffee bg-opacity-5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => onSelect(option.id)}
                className="mt-1 mr-3 text-coffee focus:ring-coffee"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{option.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Entrega estimada: {option.estimatedDays} día
                      {option.estimatedDays > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">
                      {option.price === 0
                        ? 'Gratis'
                        : `$${option.price.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
