import { useEffect, useState } from 'react';

/**
 * Hook pequeño para saber cuándo el componente se montó en el cliente.
 * Evita hydration mismatches al condicionar render que dependen de APIs cliente.
 */
export default function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
