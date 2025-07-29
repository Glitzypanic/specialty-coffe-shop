# Documentación de APIs - Coffee Shop

## Información General

**Base URL**: `http://localhost:3000/api` (desarrollo)
**Content-Type**: `application/json`
**Autenticación**: Session-based (NextAuth.js)

## Códigos de Estado

| Código | Significado                                |
| ------ | ------------------------------------------ |
| 200    | Operación exitosa                          |
| 201    | Recurso creado exitosamente                |
| 400    | Error de validación o solicitud malformada |
| 401    | No autorizado                              |
| 404    | Recurso no encontrado                      |
| 500    | Error interno del servidor                 |

## Formato de Respuestas

### Respuesta Exitosa

```json
{
  "data": "...",
  "status": 200,
  "timestamp": "2025-01-28T10:30:00.000Z"
}
```

### Respuesta de Error

```json
{
  "error": "Mensaje de error",
  "code": "ERROR_CODE",
  "details": [],
  "timestamp": "2025-01-28T10:30:00.000Z"
}
```

---

## Productos

### GET /api/products

Obtiene la lista de todos los productos disponibles.

**Parámetros**: Ninguno

**Respuesta Exitosa**:

```json
[
  {
    "_id": "60d5ecb54b24a04a6c3b1234",
    "name": "Café Colombia Supremo",
    "description": "Café de origen colombiano con notas cítricas",
    "price": 25.99,
    "image": "/images/colombia-supremo.jpg",
    "category": "cafe",
    "stock": 100,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-28T10:30:00.000Z"
  }
]
```

**Códigos de Error**:

- `500`: Error al conectar con la base de datos

---

## Carrito de Compras

### GET /api/cart

Obtiene el carrito del usuario autenticado.

**Autenticación**: Requerida

**Parámetros**: Ninguno

**Respuesta Exitosa**:

```json
{
  "cart": [
    {
      "product": {
        "_id": "60d5ecb54b24a04a6c3b1234",
        "name": "Café Colombia Supremo",
        "description": "Café de origen colombiano",
        "price": 25.99,
        "image": "/images/colombia-supremo.jpg",
        "category": "cafe",
        "stock": 100
      },
      "quantity": 2
    }
  ]
}
```

**Respuesta sin autenticación**:

```json
{
  "cart": []
}
```

### POST /api/cart

Actualiza el carrito del usuario autenticado.

**Autenticación**: Requerida

**Body**:

```json
{
  "cart": [
    {
      "product": "60d5ecb54b24a04a6c3b1234",
      "quantity": 2
    },
    {
      "product": {
        "_id": "60d5ecb54b24a04a6c3b5678"
      },
      "quantity": 1
    }
  ]
}
```

**Validaciones**:

- `cart`: Array requerido (máximo 50 items)
- `product`: String (ID) u objeto con `_id` requerido
- `quantity`: Número entero entre 1 y 999

**Respuesta Exitosa**:

```json
{
  "cart": [
    {
      "product": {
        "_id": "60d5ecb54b24a04a6c3b1234",
        "name": "Café Colombia Supremo",
        "price": 25.99,
        ...
      },
      "quantity": 2
    }
  ]
}
```

**Códigos de Error**:

- `401`: `CART_UNAUTHORIZED` - Usuario no autenticado
- `404`: `CART_USER_NOT_FOUND` - Usuario no encontrado
- `400`: `CART_INVALID_PRODUCT` - Producto inválido o sin stock
- `400`: `VALIDATION_ERROR` - Error de validación en los datos

**Ejemplo de Error de Validación**:

```json
{
  "error": "Validation error",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "inclusive": true,
      "exact": false,
      "message": "Quantity must be at least 1",
      "path": ["cart", 0, "quantity"]
    }
  ],
  "timestamp": "2025-01-28T10:30:00.000Z"
}
```

---

## Autenticación

### POST /api/auth/signin

Maneja el inicio de sesión de usuarios (NextAuth.js).

**Body**:

```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

### POST /api/auth/register

Registra un nuevo usuario.

**Body**:

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseña123",
  "phone": "+52 55 1234 5678"
}
```

**Validaciones**:

- `name`: Requerido, mínimo 2 caracteres
- `email`: Formato de email válido, único
- `password`: Mínimo 8 caracteres
- `phone`: Formato de teléfono válido

**Respuesta Exitosa**:

```json
{
  "message": "Usuario registrado exitosamente",
  "userId": "60d5ecb54b24a04a6c3b1234"
}
```

### GET /api/auth/session

Obtiene la sesión actual del usuario.

**Respuesta con sesión activa**:

```json
{
  "user": {
    "id": "60d5ecb54b24a04a6c3b1234",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+52 55 1234 5678"
  },
  "expires": "2025-02-28T10:30:00.000Z"
}
```

**Respuesta sin sesión**:

```json
null
```

---

## Órdenes

### POST /api/orders

Crea una nueva orden de compra.

**Autenticación**: Requerida

**Body**:

```json
{
  "cart": [
    {
      "product": {
        "_id": "60d5ecb54b24a04a6c3b1234",
        "name": "Café Colombia Supremo",
        "price": 25.99
      },
      "quantity": 2
    }
  ],
  "contactInfo": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+52 55 1234 5678"
  },
  "shippingAddress": {
    "street": "Av. Principal",
    "number": "123",
    "apartment": "Apt 4B",
    "city": "Ciudad de México",
    "state": "CDMX",
    "postalCode": "01000",
    "country": "México"
  },
  "billingAddress": {
    // Igual estructura que shippingAddress
    // Campos adicionales para facturación empresarial:
    "isBusiness": false,
    "companyName": "Mi Empresa S.A.",
    "taxId": "RFC123456789"
  },
  "selectedShipping": "standard",
  "discountCode": "WELCOME10",
  "total": 51.98
}
```

**Respuesta Exitosa**:

```json
{
  "orderId": "60d5ecb54b24a04a6c3b9999",
  "message": "Orden creada exitosamente",
  "total": 51.98,
  "estimatedDelivery": "2025-02-05T00:00:00.000Z"
}
```

### GET /api/orders

Obtiene las órdenes del usuario autenticado.

**Autenticación**: Requerida

**Query Parameters**:

- `page`: Número de página (opcional, default: 1)
- `limit`: Items por página (opcional, default: 10)
- `status`: Filtrar por estado (opcional)

**Respuesta Exitosa**:

```json
{
  "orders": [
    {
      "_id": "60d5ecb54b24a04a6c3b9999",
      "status": "pending",
      "total": 51.98,
      "createdAt": "2025-01-28T10:30:00.000Z",
      "items": [
        {
          "product": {
            "_id": "60d5ecb54b24a04a6c3b1234",
            "name": "Café Colombia Supremo"
          },
          "quantity": 2,
          "price": 25.99
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### GET /api/orders/:id

Obtiene una orden específica.

**Autenticación**: Requerida

**Parámetros**:

- `id`: ID de la orden

**Respuesta Exitosa**:

```json
{
  "_id": "60d5ecb54b24a04a6c3b9999",
  "status": "pending",
  "total": 51.98,
  "contactInfo": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+52 55 1234 5678"
  },
  "shippingAddress": {
    "street": "Av. Principal",
    "number": "123",
    "city": "Ciudad de México",
    "state": "CDMX",
    "postalCode": "01000",
    "country": "México"
  },
  "items": [
    {
      "product": {
        "_id": "60d5ecb54b24a04a6c3b1234",
        "name": "Café Colombia Supremo",
        "image": "/images/colombia-supremo.jpg"
      },
      "quantity": 2,
      "price": 25.99
    }
  ],
  "createdAt": "2025-01-28T10:30:00.000Z",
  "updatedAt": "2025-01-28T10:30:00.000Z"
}
```

**Códigos de Error**:

- `404`: Orden no encontrada
- `403`: La orden no pertenece al usuario actual

---

## Usuario

### GET /api/user

Obtiene información del usuario autenticado.

**Autenticación**: Requerida

**Respuesta Exitosa**:

```json
{
  "user": {
    "_id": "60d5ecb54b24a04a6c3b1234",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+52 55 1234 5678",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/user/update

Actualiza información del usuario.

**Autenticación**: Requerida

**Body**:

```json
{
  "name": "Juan Carlos Pérez",
  "phone": "+52 55 9876 5432"
}
```

**Respuesta Exitosa**:

```json
{
  "message": "Usuario actualizado exitosamente",
  "user": {
    "_id": "60d5ecb54b24a04a6c3b1234",
    "name": "Juan Carlos Pérez",
    "email": "juan@example.com",
    "phone": "+52 55 9876 5432"
  }
}
```

### POST /api/user/avatar

Actualiza el avatar del usuario.

**Autenticación**: Requerida

**Content-Type**: `multipart/form-data`

**Body**:

- `avatar`: Archivo de imagen (JPG, PNG, WEBP, máximo 5MB)

**Respuesta Exitosa**:

```json
{
  "message": "Avatar actualizado exitosamente",
  "avatarUrl": "/uploads/avatars/60d5ecb54b24a04a6c3b1234.webp"
}
```

---

## Códigos de Error Específicos

### Carrito

- `CART_UNAUTHORIZED`: Usuario no autenticado
- `CART_USER_NOT_FOUND`: Usuario no encontrado en la base de datos
- `CART_INVALID_PRODUCT`: Producto inválido o no encontrado
- `CART_PRODUCT_NOT_FOUND`: Producto específico no encontrado
- `CART_VALIDATION_ERROR`: Error de validación en los datos del carrito
- `CART_DATABASE_ERROR`: Error de base de datos

### Autenticación

- `AUTH_INVALID_CREDENTIALS`: Credenciales inválidas
- `AUTH_USER_EXISTS`: Usuario ya existe (registro)
- `AUTH_WEAK_PASSWORD`: Contraseña no cumple requisitos
- `AUTH_INVALID_EMAIL`: Formato de email inválido

### Órdenes

- `ORDER_EMPTY_CART`: Carrito vacío
- `ORDER_INVALID_ADDRESS`: Dirección inválida
- `ORDER_PAYMENT_FAILED`: Error en el pago
- `ORDER_INSUFFICIENT_STOCK`: Stock insuficiente

### General

- `VALIDATION_ERROR`: Error de validación general
- `DATABASE_ERROR`: Error de base de datos
- `INTERNAL_ERROR`: Error interno del servidor

---

## Rate Limiting

**Límites actuales** (Recomendados para producción):

- `/api/auth/*`: 10 requests por minuto por IP
- `/api/cart/*`: 30 requests por minuto por usuario
- `/api/orders/*`: 20 requests por minuto por usuario
- Otros endpoints: 60 requests por minuto por IP

## Headers de Seguridad

Todos los endpoints incluyen headers de seguridad:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

**Última actualización**: Enero 2025
**Versión API**: 1.0.0
