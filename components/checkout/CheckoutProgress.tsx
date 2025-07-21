// components/checkout/CheckoutProgress.tsx
interface CheckoutProgressProps {
  currentStep: 'contact' | 'shipping' | 'payment' | 'review';
}

const steps = [
  { id: 'contact', name: 'Contacto', icon: '👤' },
  { id: 'shipping', name: 'Envío', icon: '📦' },
  { id: 'payment', name: 'Pago', icon: '💳' },
  { id: 'review', name: 'Confirmación', icon: '✅' },
];

export default function CheckoutProgress({
  currentStep,
}: CheckoutProgressProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-coffee text-cream'
                      : 'bg-gray-200 text-gray-400'
                  }
                `}
              >
                {isCompleted ? '✓' : step.icon}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  isCurrent ? 'text-coffee' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className="w-20 h-0.5 mx-4 bg-gray-200"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
