# 🍷 Vinifica – Plataforma de Digitalización y Trazabilidad de Vinos

Vinifica es una plataforma para digitalizar los vinos que permite a los dueños de bodegas rastrear sus lotes en tiempo real para detectar cuándo se daña un vino y saber exactamente en qué parte del proceso ocurre. Los clientes pueden ver esta trazabilidad completa y, en la Fase 2, podrán comprar vinos directamente en USDC.

**Nota importante**: La **Fase 1 (MVP/Hackathon)** incluye digitalización, trazabilidad y visualización de precios en USDC, pero **NO incluye la implementación de pagos reales con USDC**. Los pagos con USDC se implementarán en la **Fase 2**.

---

## 1. Problem Statement

### What real-world problem are you solving?

La industria del vino enfrenta desafíos críticos de digitalización y trazabilidad:

- **Falta de digitalización**: Los lotes de vino no están digitalizados, dificultando el seguimiento en tiempo real
- **Detección tardía de daños**: Los dueños no pueden detectar rápidamente cuándo y dónde se daña un vino en el proceso
- **Trazabilidad fragmentada**: No existe una forma eficiente de rastrear exactamente en qué parte del proceso ocurre un problema
- **Transparencia limitada para clientes**: Los clientes no pueden verificar la trazabilidad completa de los vinos que compran
- **Falta de opciones de compra directa**: No existe una plataforma simple para que los clientes compren vinos certificados (los pagos en USDC se implementarán en Fase 2)

### For whom is this a problem?

**Para dueños de bodegas:**
- Necesitan digitalizar sus lotes de vino para tener visibilidad completa
- Requieren detectar rápidamente cuándo se daña un vino durante el proceso
- Buscan saber exactamente en qué parte del proceso (viñedo, producción, bodega, transporte, almacenamiento) ocurre el daño
- Necesitan proteger sus inversiones identificando problemas tempranamente

**Para clientes y compradores:**
- Quieren ver la trazabilidad completa de los vinos antes de comprar
- Desean verificar la autenticidad y el origen del producto
- Buscan transparencia sobre cada etapa del proceso
- En la Fase 2, necesitarán una forma sencilla de comprar vinos certificados en USDC

### Why is this problem urgent or important now?

- Las pérdidas por vinos dañados durante el proceso representan millones de dólares anuales
- La detección tardía de daños genera pérdidas significativas para los dueños de bodegas
- Los clientes demandan cada vez más transparencia sobre el origen y trazabilidad de los vinos
- La digitalización de productos premium es una tendencia creciente en la industria
- Los pagos en criptomonedas (USDC) se están volviendo más aceptados para transacciones de alto valor (implementación planificada para Fase 2)
- La tecnología permite rastrear exactamente dónde y cuándo ocurre un problema en el proceso

---

## 2. Target User and User Need

### Who is your primary user?

**Usuario primario: Dueños de Bodegas**
- Dueños de bodegas que producen vinos premium
- Necesitan digitalizar sus lotes para tener control total
- Buscan detectar problemas y daños en tiempo real durante el proceso
- Requieren identificar exactamente dónde ocurre un daño (viñedo, producción, bodega, transporte, etc.)

**Usuarios secundarios:**
- **Clientes y compradores**: Quieren ver la trazabilidad completa (en Fase 2: comprar vinos en USDC)
- **Distribuidores**: Necesitan verificar lotes y registrar eventos de recepción/transporte
- **Consumidores finales**: Desean verificar autenticidad mediante QR codes

### What is their core need or pain point?

**Dueños de Bodegas:**
- Necesitan digitalizar sus lotes para tener visibilidad completa en tiempo real
- Requieren detectar rápidamente cuándo se daña un vino durante el proceso
- Buscan saber exactamente en qué parte del proceso ocurre el daño
- Necesitan proteger sus inversiones identificando problemas tempranamente
- Desean registrar cada etapa del proceso (viñedo, producción, bodega, almacenamiento, transporte, exportación)

**Clientes y Compradores:**
- Quieren ver la trazabilidad completa de los vinos antes de comprar
- Desean verificar la autenticidad y el origen del producto
- Necesitan transparencia sobre cada etapa del proceso
- En la Fase 2, buscan una forma sencilla de comprar vinos certificados en USDC

**Consumidores:**
- Quieren verificar que el vino es auténtico mediante QR codes
- Desean conocer la historia completa del producto desde el viñedo hasta el embotellado

### How do they currently solve this?

**Bodegas:**
- Usan sistemas de gestión internos no conectados
- Emiten certificados en papel que pueden perderse o falsificarse
- Dependen de sistemas centralizados vulnerables
- **Workaround actual**: Documentación física, sistemas aislados, sin verificación pública

**Distribuidores/Importadores:**
- Confían en documentación en papel
- No tienen forma de verificar la autenticidad de los lotes
- **Workaround actual**: Confianza en la cadena de suministro, sin verificación independiente

**Consumidores:**
- Confían en el retailer o la marca
- No tienen forma de verificar autenticidad
- **Workaround actual**: No hay forma real de verificar, solo confianza

---

## 3. Solution Overview

### 3.1 Main Idea

Vinifica es una plataforma para digitalizar los vinos que permite a los dueños de bodegas rastrear sus lotes en tiempo real para detectar cuándo se daña un vino y saber exactamente en qué parte del proceso ocurre. Los clientes pueden ver esta trazabilidad completa y, en la Fase 2, podrán comprar vinos directamente en USDC.

**Core user journey (Fase 1 - MVP/Hackathon):**

1. **Digitalización**: El dueño de la bodega registra un lote de vino con información completa (varietal, región, año, cantidad, precio en USDC para visualización), sube documentación certificada, y se genera un Certificado de Autenticidad único
2. **Trazabilidad en Tiempo Real**: El dueño y su equipo registran eventos en cada etapa del proceso (viñedo, producción, bodega, almacenamiento, transporte, exportación). Si ocurre un daño, se registra inmediatamente con ubicación exacta
3. **Detección de Daños**: El sistema permite detectar rápidamente cuándo se daña un vino y en qué parte exacta del proceso, permitiendo acciones correctivas inmediatas
4. **Visualización para Clientes**: Los clientes pueden ver la trazabilidad completa de cualquier lote, verificando cada etapa del proceso
5. **Visualización de Precios**: Los clientes pueden ver los precios en USDC de los lotes disponibles (pagos reales implementados en Fase 2)
6. **Verificación por QR**: Cada botella tiene un QR único que, al ser escaneado, muestra la trazabilidad completa verificable

**Fase 2 (Post-Hackathon):**
- Implementación de pagos reales con USDC utilizando Stellar
- Integración con wallets (Freighter, WalletConnect)
- Procesamiento de transacciones en blockchain
- Transferencia de ownership tras la compra

### 3.2 Why Stellar?

**Stellar Network es ideal para Winefy porque:**

- **Inmutabilidad garantizada**: Una vez registrados, los eventos no pueden ser alterados, garantizando la integridad de los datos
- **Transparencia verificable**: Cualquiera puede auditar los eventos del lote en la blockchain pública
- **Bajo costo**: Comisiones mínimas ($0.00001) permiten registrar muchos eventos sin costo prohibitivo
- **Rapidez**: Transacciones confirmadas en 3-5 segundos
- **Soroban Smart Contracts**: Para lógica compleja como:
  - Validación de roles (bodega, distribuidor, importador)
  - Registro de eventos de trazabilidad
  - Transferencias verificadas entre actores
  - Garantía de inmutabilidad de datos
- **Asset Issuance**: Creación de Wine Traceability Tokens (WTT) representando lotes
- **Transparencia verificable**: Cualquiera puede auditar los eventos del lote

**Elementos de Stellar que usaremos:**

- ✅ **Stellar Network**: Para transacciones y registro de eventos
- ✅ **Soroban Smart Contracts**: Para lógica de trazabilidad (Traceability Contract)
  - Crear lote (WTT)
  - Registrar eventos
  - Transferencias verificadas
  - Validación de roles
- ✅ **Asset Issuance**: Creación de Wine Traceability Tokens (WTT)
- ✅ **Stellar SDK**: Integración frontend/backend con la red
- ✅ **Blockchain pública**: Para transparencia verificable

**Características clave:**
- **Certificación de lotes**: Cada lote se certifica con un WTT en Stellar
- **Registro de eventos de trazabilidad**: Cada evento queda registrado en blockchain
- **Validación de roles**: Verificación de permisos (bodega, distribuidor, importador)
- **Garantía de inmutabilidad**: Los datos no pueden ser alterados una vez registrados
- **Transparencia verificable**: Cualquiera puede auditar los eventos del lote

---

## 4. Core Features

### Fase 1 (MVP/Hackathon)

### Feature 1: Digitalización del Lote
**What the user can do:**
- Los dueños de bodegas registran información completa del lote: varietal, región, año, cantidad, precio en USDC (para visualización)
- Suben documentación certificada (certificados de origen, análisis, etc.)
- Se genera un Certificado de Autenticidad único para ese lote
- El lote queda digitalizado y listo para rastreo en tiempo real

**How we will know if it's working:**
- Un dueño puede completar el formulario de registro de lote con precio en USDC (mostrado pero no procesado)
- El Certificado de Autenticidad se genera exitosamente
- El lote aparece en el dashboard con su certificado verificado
- Los documentos quedan asociados al lote

### Feature 2: Registro de Eventos de Trazabilidad y Detección de Daños
**What the user can do:**
- El dueño y su equipo registran eventos en cada etapa del proceso: viñedo, producción, bodega, almacenamiento, transporte, exportación
- Si ocurre un daño, se registra inmediatamente con ubicación exacta y descripción del problema
- El sistema permite detectar rápidamente cuándo se daña un vino y en qué parte exacta del proceso
- Cada evento queda registrado con timestamp y ubicación precisa
- Los eventos aparecen en un timeline verificable con alertas para daños

**How we will know if it's working:**
- Los eventos se registran exitosamente en cada etapa del proceso
- Los eventos aparecen en un timeline cronológico con ubicación exacta
- Si se registra un daño, se muestra una alerta inmediata
- El dueño puede ver exactamente en qué parte del proceso ocurrió el daño
- Los eventos son verificables y transparentes

### Feature 3: Dashboard de Trazabilidad
**What the user can do:**
- Ver todos los lotes digitalizados
- Ver estado actual, etapas completadas y documentos asociados
- Consultar información desde cualquier dispositivo
- Ver timeline completo de eventos para cada lote

**How we will know if it's working:**
- El dashboard muestra todos los lotes registrados
- Cada lote muestra su estado actual y eventos completados
- La información se carga desde Stellar y la base de datos
- El dashboard es responsive y funciona en móviles

### Feature 4: Visualización de Trazabilidad para Clientes
**What the user can do:**
- Los clientes pueden ver la trazabilidad completa de cualquier lote disponible
- Visualizan cada etapa del proceso (viñedo, producción, bodega, transporte, etc.)
- Pueden verificar la autenticidad y el origen del producto
- Acceso a documentación certificada del lote

**How we will know if it's working:**
- Los clientes pueden acceder a la página de lotes y ver la trazabilidad completa
- Se muestra un timeline con todas las etapas del proceso
- La información es transparente y verificable
- Los clientes pueden verificar autenticidad antes de comprar

### Feature 5: Visualización de Lotes y Precios en USDC (Fase 1)
**What the user can do (Fase 1):**
- Los clientes pueden ver todos los lotes disponibles con sus precios en USDC
- Pueden ver la interfaz de compra y simular el proceso de compra
- Los lotes se pueden marcar como "vendidos" para demostración (sin procesamiento de pago real)

**How we will know if it's working:**
- Los clientes pueden ver los precios en USDC en cada lote
- Pueden acceder a la página de compra y ver la interfaz
- La simulación de compra funciona correctamente
- **Nota**: Los pagos reales con USDC se implementarán en la Fase 2

### Feature 6: Compra de Vinos en USDC (Fase 2 - Post-Hackathon)
**What the user will be able to do (Fase 2):**
- Los clientes podrán comprar lotes certificados directamente en USDC usando Stellar
- Integración con wallets (Freighter, WalletConnect) para procesar pagos
- Transferencia de ownership del lote tras la compra exitosa
- Procesamiento de transacciones en blockchain de Stellar
- Registro inmutable de la compra en blockchain

**How we will know if it's working (Fase 2):**
- Los pagos se procesan exitosamente en Stellar usando USDC
- Las transacciones se confirman en blockchain
- El ownership del lote se transfiere al comprador
- La compra queda registrada de forma inmutable

### Feature 7: QR para Autenticidad (para Consumidores)
**What the user can do:**
- Cada lote/botella genera un QR único
- Al escanear el QR, el usuario ve la trazabilidad completa del lote
- Verificación de autenticidad en tiempo real
- Acceso a documentación certificada

**How we will know if it's working:**
- Se genera un QR único para cada lote/botella
- Al escanear el QR, se muestra la información de trazabilidad
- La información es verificable
- Los consumidores pueden verificar autenticidad

### Feature 5: (Stretch Goal) Transferencia de Lotes entre Actores
**What the user can do:**
- Se puede transferir ownership del lote del productor → distribuidor → retailer
- Cada transferencia queda registrada en Stellar
- Validación de roles antes de permitir transferencias
- Historial completo de ownership

**How we will know if it's working:**
- Un lote puede ser transferido entre actores autorizados
- La transferencia se registra en Stellar
- El historial de ownership es visible y verificable
- Los roles son validados correctamente

---

## 5. MVP Architecture (Initial Idea)

### Frontend
- **Framework**: Next.js 15 (React 19, TypeScript)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Stellar Integration**: 
  - `@stellar/stellar-sdk` para interacción con Stellar
  - `@stellar/freighter-api` para integración con Freighter wallet
  - WalletConnect para soporte de múltiples wallets
- **QR Generation**: Librería para generar QR codes únicos

**Pages (Fase 1):**
- `/` - Homepage con información sobre digitalización y trazabilidad
- `/lotes` - Lista de todos los lotes certificados con precios en USDC (visualización)
- `/lotes/nuevo` - Formulario para registrar nuevo lote (con precio en USDC para visualización)
- `/lotes/[id]` - Detalle de lote con timeline de eventos y detección de daños
- `/buy` - Página para ver lotes disponibles con precios en USDC (interfaz de compra, pagos reales en Fase 2)
- `/qr/[code]` - Vista pública para escanear QR (sin login requerido)
- `/eventos/registrar` - Formulario para registrar eventos de trazabilidad y daños

### Backend / Services
- **Runtime**: Node.js
- **Framework**: Next.js API Routes o Express.js
- **Stellar Integration**: 
  - Servicio para crear y gestionar WTT en Stellar
  - Servicio para registrar eventos de trazabilidad
  - Integración con Soroban para smart contracts

**API Endpoints (planned):**
- `POST /api/lotes` - Crear nuevo lote y generar WTT
- `GET /api/lotes` - Listar todos los lotes
- `GET /api/lotes/[id]` - Obtener detalles de un lote
- `POST /api/eventos` - Registrar evento de trazabilidad
- `GET /api/eventos/[loteId]` - Obtener eventos de un lote
- `GET /api/qr/[code]` - Verificar QR y obtener información del lote
- `POST /api/transferencias` - Transferir ownership de un lote

### Smart Contracts (Soroban)
- **Traceability Contract**: 
  - Crear lote (WTT)
  - Registrar eventos de trazabilidad
  - Transferencias verificadas entre actores
  - Validación de roles (bodega, distribuidor, importador)
  - Garantía de inmutabilidad de datos

**Lenguaje**: Rust (Soroban)

### Data / Storage
- **Database**: PostgreSQL o Supabase
  - Información de lotes (metadatos)
  - Documentos de certificación
  - Usuarios y roles
  - Eventos de trazabilidad (cache local, fuente de verdad en Stellar)

- **Blockchain**: Stellar Network
  - Wine Traceability Tokens (WTT) representando lotes
  - Eventos de trazabilidad registrados en cadena
  - Transferencias de ownership
  - Validación de roles

- **File Storage**: 
  - Documentos de certificación (Supabase Storage, AWS S3, o IPFS)
  - Imágenes de lotes y botellas

### Architecture Diagram

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Frontend (Next.js)          │
│  - React Components                 │
│  - Stellar SDK Integration          │
│  - QR Code Generation               │
│  - Dashboard & Forms                │
└──────┬──────────────────┬───────────┘
       │                  │
       │                  │
       ▼                  ▼
┌──────────────┐   ┌──────────────┐
│   Backend    │   │   Stellar    │
│  (API Routes)│   │   Network    │
│              │   │              │
│  - Business  │   │  - WTT       │
│    Logic     │◄──┤  - Events    │
│  - Auth      │   │  - Soroban   │
│  - File      │   │    Contracts │
│    Upload    │   │              │
└──────┬───────┘   └──────────────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │
│  / Supabase  │
│              │
│  - Lotes     │
│  - Eventos   │
│  - Users     │
│  - Docs      │
└──────────────┘
```

---

## 6. Success Criteria

### Fase 1 (MVP/Hackathon)

By the end of Stellar Hack+, we will consider our MVP successful if:

- [ ] **Un dueño puede digitalizar un lote**: Complete el formulario de registro con precio en USDC (para visualización), suba documentación, y se genere exitosamente un Certificado de Autenticidad
- [ ] **Se pueden registrar eventos de trazabilidad y detectar daños**: Los eventos se registran en cada etapa del proceso (viñedo, producción, bodega, transporte, etc.) y si hay un daño, se detecta inmediatamente con ubicación exacta
- [ ] **El dueño puede ver exactamente dónde ocurre un daño**: Si un vino se daña, el sistema muestra en qué parte exacta del proceso ocurrió el problema
- [ ] **Los clientes pueden ver la trazabilidad completa**: Los clientes pueden acceder a la información de trazabilidad de cualquier lote disponible
- [ ] **Los clientes pueden ver precios en USDC**: Los clientes pueden ver los precios en USDC y la interfaz de compra (pagos reales implementados en Fase 2)
- [ ] **Un QR permite ver información real del lote**: Se genera un QR único para un lote, y al escanearlo se muestra la trazabilidad completa verificable
- [ ] **Se demuestra un flujo completo**: Crear lote → registrar eventos → detectar daño → visualizar trazabilidad → ver precios en USDC → escanear QR, todo funcionando end-to-end

**Nota importante**: Los pagos reales con USDC NO están incluidos en la Fase 1. Se implementarán en la Fase 2.

**Stretch Goals (Fase 1):**
- [ ] Notificaciones en tiempo real cuando se detecta un daño
- [ ] App móvil liviana para registrar eventos y escanear QR codes
- [ ] Integración con sistemas existentes de bodegas
- [ ] Análisis predictivo para prevenir daños

### Fase 2 (Post-Hackathon)

Los siguientes criterios se implementarán después del hackathon:

- [ ] **Implementación de pagos reales con USDC**: Integración completa con Stellar para procesar pagos en USDC
- [ ] **Integración con wallets**: Soporte para Freighter, WalletConnect y otros wallets compatibles con Stellar
- [ ] **Transferencia de ownership**: El ownership del lote se transfiere automáticamente al comprador tras el pago exitoso
- [ ] **Registro inmutable de compras**: Todas las compras quedan registradas en blockchain de Stellar
- [ ] **Procesamiento de transacciones**: Manejo completo de transacciones, errores y confirmaciones en blockchain

---

## 7. Team

- **Team name**: Vinifica

- **Members and roles**:
  - **Mateo Quintana** – Product and Marketing
  - **Anwar Sánchez** – Frontend & Blockchain
  - **Manuel Paredes** – Backend & Blockchain

- **Links**:
  - GitHub: (Add your repo link)
  - Demo: (Add demo link when available)
  - Stellar Account: (Add Stellar account if public)

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Stellar Testnet account (for development)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
DATABASE_URL=your_database_url
```

### Stellar Setup

1. Create a Stellar testnet account
2. Fund it with testnet lumens
3. Configure your environment variables
4. Deploy Soroban contracts (when ready)

---

## License

MIT
