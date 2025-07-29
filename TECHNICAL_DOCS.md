# Documentación Técnica - Coffee Shop

## Tabla de Contenidos

1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Patrones de Diseño](#patrones-de-diseño)
5. [Gestión del Estado](#gestión-del-estado)
6. [Base de Datos](#base-de-datos)
7. [APIs y Endpoints](#apis-y-endpoints)
8. [Autenticación](#autenticación)
9. [Performance y Optimizaciones](#performance-y-optimizaciones)
10. [Testing](#testing)
11. [Deployment](#deployment)

## Arquitectura del Proyecto

### Stack Tecnológico

- **Frontend**: Next.js 15 con App Router
- **Backend**: API Routes de Next.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS
- **Validación**: Zod
- **Lenguaje**: TypeScript

### Arquitectura de Componentes

```
┌─────────────────┐
│    Layout       │
├─────────────────┤
│    Header       │
├─────────────────┤
│    Main         │
│  ┌───────────┐  │
│  │   Pages   │  │
│  └───────────┘  │
├─────────────────┤
│    Footer       │
└─────────────────┘
```

## Estructura de Directorios

```
specialty-coffee-shop/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Endpoints de autenticación
│   │   ├── cart/                 # Gestión del carrito
│   │   ├── products/             # CRUD de productos
│   │   └── orders/               # Gestión de pedidos
│   ├── (pages)/                  # Páginas de la aplicación
│   └── globals.css               # Estilos globales
├── components/                   # Componentes React
│   ├── common/                   # Componentes reutilizables
│   ├── ecommerce/                # Componentes específicos del e-commerce
│   ├── checkout/                 # Componentes del proceso de compra
│   └── layout/                   # Componentes de layout
├── hooks/                        # Custom hooks
├── lib/                          # Utilidades y configuraciones
│   ├── validations/              # Esquemas de validación con Zod
│   └── utils/                    # Funciones utilitarias
├── models/                       # Modelos de MongoDB
├── types/                        # Definiciones de TypeScript
└── public/                       # Archivos estáticos
```

## Patrones de Diseño

### 1. Context + Provider Pattern

**Ubicación**: `components/ecommerce/CartContext.tsx`

```typescript
// Ejemplo de uso del patrón Context
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Lógica del estado global del carrito
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

**Beneficios**:

- Estado global accesible en toda la aplicación
- Evita prop drilling
- Separación de responsabilidades

### 2. Custom Hooks Pattern

**Ubicación**: `hooks/`

```typescript
// Ejemplo: useFormValidation
export function useFormValidation<T>(
  initialData: T,
  validationRules: ValidationRule<T>
) {
  // Lógica reutilizable de validación
}
```

**Beneficios**:

- Reutilización de lógica
- Separación de estado y presentación
- Código más testeable

### 3. Error Boundary Pattern

**Ubicación**: `lib/utils/api-error-handler.ts`

```typescript
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  // Manejo centralizado de errores
}
```

### 4. Repository Pattern (Implícito)

**Ubicación**: `app/api/` routes

- Separación de la lógica de datos de la lógica de presentación
- Cada endpoint actúa como un repository para su recurso

## Gestión del Estado

### Estado Global

1. **CartContext**: Gestión del carrito de compras

   - Sincronización entre localStorage y servidor
   - Operaciones CRUD del carrito
   - Cálculos automáticos (total items, precio total)

2. **SessionContext**: Gestión de autenticación (NextAuth.js)

### Estado Local

- React useState para formularios
- Custom hooks para lógica específica
- useFormValidation para validaciones

### Flujo de Datos

```
User Action → Component → Custom Hook → Context/API → State Update → Re-render
```

## Base de Datos

### Modelos de Datos

#### User Model

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  cart: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Product Model

```typescript
interface Product {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Order Model

```typescript
interface Order {
  _id: ObjectId;
  user: ObjectId;
  items: CartItem[];
  contactInfo: ContactInfo;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Conexión a la Base de Datos

**Ubicación**: `lib/db.ts`

- Pool de conexiones optimizado
- Manejo de reconexión automática
- Logging de conexiones

## APIs y Endpoints

### Estructura de Respuestas

```typescript
// Respuesta exitosa
{
  data: T,
  status: number,
  timestamp: string
}

// Respuesta de error
{
  error: string,
  code: string,
  details?: unknown,
  timestamp: string
}
```

### Endpoints Principales

#### `/api/products`

- `GET`: Lista todos los productos
- Filtrado por stock disponible
- Paginación (futuro)

#### `/api/cart`

- `GET`: Obtiene el carrito del usuario
- `POST`: Actualiza el carrito completo

#### `/api/auth/[...nextauth]`

- Manejo de autenticación con NextAuth.js
- Providers: credentials, Google (futuro)

#### `/api/orders`

- `POST`: Crear nueva orden
- `GET`: Obtener órdenes del usuario (futuro)

### Validación de Datos

**Ubicación**: `lib/validations/`

```typescript
// Ejemplo de esquema con Zod
export const CartItemSchema = z.object({
  product: z.union([z.string().min(1), z.object({ _id: z.string().min(1) })]),
  quantity: z.number().int().min(1).max(999),
});
```

## Autenticación

### NextAuth.js Configuration

**Ubicación**: `app/api/auth/[...nextauth]/route.ts`

- Estrategia de credentials
- JWT tokens
- Session management
- Callbacks personalizados

### Protección de Rutas

```typescript
// Middleware para proteger rutas
export function validateAuthentication(session: Session | null): void {
  if (!session?.user?.email) {
    throw new ApiError(401, 'Authentication required');
  }
}
```

## Performance y Optimizaciones

### Next.js Optimizations

1. **App Router**: Renderizado del lado del servidor mejorado
2. **Image Optimization**: Next.js Image component
3. **Bundle Splitting**: Configuración personalizada en next.config.ts
4. **Code Splitting**: Dynamic imports para componentes pesados

### Custom Optimizations

1. **Lazy Loading**: HOC para componentes pesados
2. **Debouncing**: Hooks para optimizar búsquedas
3. **Memoization**: useMemo y useCallback estratégicos
4. **Caching**: Headers de cache optimizados

### Métricas de Performance

- Core Web Vitals optimizados
- Lighthouse score > 90
- Bundle size optimizado

## Testing (Recomendaciones)

### Testing Strategy

1. **Unit Tests**: Jest + React Testing Library
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Playwright/Cypress

### Archivos de Test Recomendados

```
__tests__/
├── components/
│   ├── CartContext.test.tsx
│   └── FormInput.test.tsx
├── hooks/
│   ├── useFormValidation.test.ts
│   └── useDebounce.test.ts
├── api/
│   ├── cart.test.ts
│   └── products.test.ts
└── utils/
    └── api-error-handler.test.ts
```

## Deployment

### Vercel (Recomendado)

1. **Build Optimization**: Next.js optimizado para Vercel
2. **Environment Variables**: Configuración segura
3. **Edge Functions**: Para mejor performance global

### Docker (Alternativo)

```dockerfile
# Dockerfile optimizado para Next.js
FROM node:18-alpine AS base
# ... configuración de Docker
```

### Variables de Entorno

```env
# .env.local
MONGODB_URI=mongodb://localhost:27017/coffee-shop
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Consideraciones de Seguridad

1. **CSRF Protection**: NextAuth.js built-in
2. **Input Validation**: Zod schemas
3. **SQL Injection**: Mongoose ODM protection
4. **XSS Protection**: React built-in + CSP headers
5. **Rate Limiting**: Implementar en producción

## Monitoring y Logging

### Recomendaciones

1. **Error Tracking**: Sentry
2. **Performance Monitoring**: Vercel Analytics
3. **Database Monitoring**: MongoDB Atlas
4. **Custom Logging**: Winston/Pino

---

**Última actualización**: Enero 2025
**Versión**: 1.0.0
