// components/checkout/ContactForm.tsx
import { ContactInfo } from '@/types/checkout';

interface ContactFormProps {
  contactInfo: ContactInfo;
  onChange: (info: ContactInfo) => void;
  errors: Record<string, string>;
}

export default function ContactForm({
  contactInfo,
  onChange,
  errors,
}: ContactFormProps) {
  const handleChange = (field: keyof ContactInfo, value: string) => {
    onChange({ ...contactInfo, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-coffee mb-4">
        Información de Contacto
      </h3>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre Completo *
        </label>
        <input
          type="text"
          id="name"
          value={contactInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
            ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Juan Pérez"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Correo Electrónico *
        </label>
        <input
          type="email"
          id="email"
          value={contactInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
            ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="juan@ejemplo.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Teléfono *
        </label>
        <input
          type="tel"
          id="phone"
          value={contactInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee 
            ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="+52 55 1234 5678"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>
    </div>
  );
}
