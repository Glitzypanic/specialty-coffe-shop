# ☕ Coffee Shop - E-commerce de Café de Especialidad

Una plataforma moderna de e-commerce desarrollada con Next.js 15, especializada en café de especialidad y accesorios para baristas.

## 🚀 Características Principales

- **🛒 E-commerce Completo**: Catálogo de productos, carrito de compras y proceso de checkout
- **👤 Autenticación**: Sistema de usuarios con NextAuth.js
- **📱 Responsive Design**: Optimizado para dispositivos móviles y desktop
- **🎨 UI Moderna**: Diseño limpio y profesional con Tailwind CSS
- **⚡ Performance**: Optimizado para Core Web Vitals y SEO
- **🔒 Seguridad**: Validación robusta y manejo seguro de datos
- **🌐 API REST**: Endpoints bien documentados y validados

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

### Backend

- **Next.js API Routes** - API REST integrada
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **NextAuth.js** - Autenticación y autorización

### DevTools

- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **TypeScript** - Análisis de tipos

## 📁 Estructura del Proyecto

```
specialty-coffee-shop/
├── 📁 app/                    # App Router de Next.js
│   ├── 📁 api/               # Endpoints de la API
│   │   ├── 🔐 auth/         # Autenticación
│   │   ├── 🛒 cart/         # Carrito de compras
│   │   ├── 📦 products/     # Productos
│   │   └── 📋 orders/       # Órdenes
│   ├── 📁 (pages)/          # Páginas de la aplicación
│   └── 🎨 globals.css       # Estilos globales
├── 📁 components/            # Componentes React
│   ├── 🔧 common/           # Componentes reutilizables
│   ├── 🛍️ ecommerce/        # Componentes de e-commerce
│   └── 💳 checkout/         # Proceso de compra
├── 📁 hooks/                # Custom React Hooks
├── 📁 lib/                  # Utilidades y configuraciones
├── 📁 models/               # Modelos de MongoDB
├── 📁 types/                # Definiciones TypeScript
└── 📁 public/               # Archivos estáticos
```

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18.x o superior
- npm, yarn, pnpm o bun
- MongoDB (local o Atlas)

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/specialty-coffee-shop.git
   cd specialty-coffee-shop
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

   Editar `.env.local` con tus configuraciones:

   ```env
   # Base de datos
   MONGODB_URI=mongodb://localhost:27017/coffee-shop

   # Autenticación (generar con: openssl rand -base64 32)
   NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui
   NEXTAUTH_URL=http://localhost:3000

   # URLs públicas
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Inicializar la base de datos** (opcional)

   ```bash
   npm run db:seed
   ```

5. **Ejecutar en desarrollo**

   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**

   Visita [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con Turbopack
npm run dev:debug    # Desarrollo con debugging habilitado

# Construcción
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción
npm run preview      # Preview de la build

# Calidad de código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de ESLint automáticamente
npm run type-check   # Verificar tipos de TypeScript

# Base de datos
npm run db:seed      # Sembrar datos iniciales
npm run db:reset     # Resetear base de datos

# Testing (configurar)
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:e2e     # Tests end-to-end
```

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable                 | Descripción               | Requerida | Default |
| ------------------------ | ------------------------- | --------- | ------- |
| `MONGODB_URI`            | URL de conexión a MongoDB | ✅        | -       |
| `NEXTAUTH_SECRET`        | Secreto para JWT tokens   | ✅        | -       |
| `NEXTAUTH_URL`           | URL base de la aplicación | ✅        | -       |
| `NEXT_PUBLIC_BASE_URL`   | URL pública base          | ✅        | -       |
| `NEXT_PUBLIC_GA_ID`      | Google Analytics ID       | ❌        | -       |
| `GOOGLE_VERIFICATION_ID` | Google Search Console     | ❌        | -       |

### Base de Datos

#### Conexión Local (MongoDB)

```bash
# Instalar MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb/brew/mongodb-community
```

#### MongoDB Atlas (Cloud)

1. Crear cuenta en [MongoDB Atlas](https://cloud.mongodb.com)
2. Crear cluster gratuito
3. Configurar acceso de red (IP whitelist)
4. Obtener connection string
5. Configurar `MONGODB_URI` en `.env.local`

### Autenticación

El proyecto usa NextAuth.js con estrategia de credentials. Para configurar providers adicionales:

```typescript
// app/api/auth/[...nextauth]/route.ts
providers: [
  CredentialsProvider({...}),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
]
```

## 🧪 Testing

### Configuración de Tests (Próximamente)

```bash
# Instalar dependencias de testing
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm run test
```

### Estructura de Tests

```
__tests__/
├── components/
├── hooks/
├── pages/
└── utils/
```

## 🚀 Deployment

### Vercel (Recomendado)

1. **Conectar con GitHub**

   - Fork el repositorio
   - Conectar con Vercel

2. **Configurar variables de entorno**

   ```
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_SECRET=production-secret
   NEXTAUTH_URL=https://tu-dominio.vercel.app
   NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
   ```

3. **Deploy automático**
   - Cada push a `main` despliega automáticamente

### Docker

```dockerfile
# Dockerfile incluido para deployment con Docker
docker build -t coffee-shop .
docker run -p 3000:3000 coffee-shop
```

### Manual

```bash
# Construir para producción
npm run build

# Ejecutar en servidor
npm start
```

## 📖 Documentación

- 📚 [Documentación Técnica](./TECHNICAL_DOCS.md)
- 🔌 [Documentación de APIs](./API_DOCS.md)
- 🛒 [Guía de Checkout](./CHECKOUT_README.md)
- 👤 [Actualización de Usuario](./ACTUALIZACION_USUARIO.md)

## 🏗️ Arquitectura

### Flujo de Datos

```
User → Component → Hook → Context/API → Database
                ↓
         State Update → Re-render
```

### Patrones Utilizados

- **Context + Provider**: Estado global (carrito, autenticación)
- **Custom Hooks**: Lógica reutilizable
- **Repository Pattern**: Separación de datos
- **Error Boundary**: Manejo de errores

## 🔒 Seguridad

- ✅ Validación de entrada con Zod
- ✅ Sanitización de datos
- ✅ Headers de seguridad configurados
- ✅ CSRF protection (NextAuth.js)
- ✅ XSS protection
- ✅ Rate limiting (recomendado en producción)

## 🎯 Performance

### Optimizaciones Implementadas

- ⚡ App Router de Next.js 15
- 🖼️ Optimización de imágenes
- 📦 Code splitting automático
- 🗄️ Caching inteligente
- 🏃‍♂️ Lazy loading de componentes
- 📊 Bundle analysis

### Métricas Objetivo

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Lighthouse Score**: > 90

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Convenciones de Código

- **Commits**: Conventional Commits
- **Code Style**: ESLint + Prettier
- **Naming**: camelCase para JS, kebab-case para CSS
- **Components**: PascalCase

## 🐛 Troubleshooting

### Problemas Comunes

**Error de conexión a MongoDB**

```bash
# Verificar que MongoDB esté ejecutándose
brew services list | grep mongodb

# Verificar conexión
mongosh "mongodb://localhost:27017"
```

**Error de autenticación**

```bash
# Regenerar NEXTAUTH_SECRET
openssl rand -base64 32
```

**Error de dependencias**

```bash
# Limpiar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Logs de Desarrollo

```bash
# Ver logs de la aplicación
npm run dev

# Ver logs de MongoDB
tail -f /usr/local/var/log/mongodb/mongo.log
```

## 📝 Roadmap

- [ ] 🔍 Búsqueda avanzada de productos
- [ ] ⭐ Sistema de reviews y ratings
- [ ] 📊 Dashboard de administrador
- [ ] 💳 Integración con Stripe/PayPal
- [ ] 📧 Sistema de emails transaccionales
- [ ] 🌍 Internacionalización (i18n)
- [ ] 📱 Progressive Web App (PWA)
- [ ] 🔔 Notificaciones push

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org) - Framework de React
- [Tailwind CSS](https://tailwindcss.com) - Framework de CSS
- [MongoDB](https://mongodb.com) - Base de datos
- [Vercel](https://vercel.com) - Plataforma de deployment

---

**Desarrollado con ❤️ para los amantes del café**

¿Tienes preguntas? [Abre un issue](https://github.com/tu-usuario/specialty-coffee-shop/issues) o [contáctanos](mailto:support@coffee-shop.com)
