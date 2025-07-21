// components/checkout/AddressForm.tsx
import { ShippingAddress, BillingAddress } from '@/types/checkout';

interface AddressFormProps {
  address: ShippingAddress | BillingAddress;
  onChange: (address: ShippingAddress | BillingAddress) => void;
  errors: Record<string, string>;
  type: 'shipping' | 'billing';
  countries: string[];
}

export default function AddressForm({
  address,
  onChange,
  errors,
  type,
  countries,
}: AddressFormProps) {
  const handleChange = (field: keyof ShippingAddress, value: string) => {
    onChange({ ...address, [field]: value });
  };

  const handleBillingChange = (
    field: keyof BillingAddress,
    value: string | boolean
  ) => {
    if (type === 'billing') {
      onChange({ ...address, [field]: value } as BillingAddress);
    }
  };

  const isBilling = type === 'billing';
  const billingAddress = isBilling ? (address as BillingAddress) : null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-coffee mb-4">
        {type === 'shipping'
          ? 'Dirección de Envío'
          : 'Dirección de Facturación'}
      </h3>

      {isBilling && (
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={billingAddress?.isBusiness || false}
              onChange={(e) =>
                handleBillingChange('isBusiness', e.target.checked)
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              Facturación empresarial
            </span>
          </label>
        </div>
      )}

      {isBilling && billingAddress?.isBusiness && (
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Razón Social *
          </label>
          <input
            type="text"
            id="companyName"
            value={billingAddress.companyName || ''}
            onChange={(e) => handleBillingChange('companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
            placeholder="Nombre de la empresa"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Calle *
          </label>
          <input
            type="text"
            id="street"
            value={address.street}
            onChange={(e) => handleChange('street', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
              ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Av. Insurgentes Sur"
          />
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{errors.street}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Número *
          </label>
          <input
            type="text"
            id="number"
            value={address.number}
            onChange={(e) => handleChange('number', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
              ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="1234"
          />
          {errors.number && (
            <p className="text-red-500 text-sm mt-1">{errors.number}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="apartment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Apartamento/Depto (Opcional)
        </label>
        <input
          type="text"
          id="apartment"
          value={address.apartment || ''}
          onChange={(e) => handleChange('apartment', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
          placeholder="Apto 5B"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ciudad *
          </label>
          <input
            type="text"
            id="city"
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
              ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ciudad de México"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Estado *
          </label>
          <input
            type="text"
            id="state"
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
              ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="CDMX"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Código Postal *
          </label>
          <input
            type="text"
            id="postalCode"
            value={address.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
              ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="01000"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          País *
        </label>
        <select
          id="country"
          value={address.country}
          onChange={(e) => handleChange('country', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
            ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Seleccionar país</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country}</p>
        )}
      </div>

      {isBilling && (
        <div>
          <label
            htmlFor="taxId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            RFC/Tax ID {billingAddress?.isBusiness ? '*' : '(Opcional)'}
          </label>
          <input
            type="text"
            id="taxId"
            value={billingAddress?.taxId || ''}
            onChange={(e) => handleBillingChange('taxId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
            placeholder="ABCD123456XXX"
          />
        </div>
      )}
    </div>
  );
}
