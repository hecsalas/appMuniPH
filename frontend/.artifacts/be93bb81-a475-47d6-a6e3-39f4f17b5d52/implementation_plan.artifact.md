# Reestructuración Integral: Fusión y Separación de Lógica (Backend vs Frontend)

Este plan detalla la transformación del proyecto en un Monorepo con solo dos carpetas raíz, separando estrictamente la lógica de negocio del diseño visual para las tres aplicaciones (Móvil, Administrador Municipal y Socio Proveedor).

## User Review Required

> [!CAUTION]
> Esta es una reestructuración masiva. Moveremos todos los archivos del proyecto.
> 1. **Fusión Web**: Los dos portales web se convertirán en uno solo con rutas separadas por roles.
> 2. **Desacoplamiento Móvil**: La lógica de Supabase y validaciones se moverá a un paquete separado en la carpeta `backend`.
> 3. **Configuración del IDE**: Es posible que debas reiniciar el servidor de desarrollo y actualizar las dependencias tras el movimiento.

## Proposed Changes

### [Carpeta: backend/] - El "Cerebro" y los Datos
Centralizará toda la funcionalidad y conexión a datos.

#### [NEW] database/
- Repositorio de scripts SQL, migraciones y políticas RLS para Supabase.

#### [NEW] web-logic/ (TypeScript)
- `services/`: Funciones compartidas para los portales web (Reportes, Excel, Auth).
- `models/`: Interfaces de datos unificadas.

#### [NEW] mobile-logic/ (Dart Package)
- Extracción de servicios de `beneficios.dart`, `login.dart` y `historialBeneficios.dart`.
- Manejo centralizado del cliente Supabase para la App.

---

### [Carpeta: frontend/] - Las Interfaces de Usuario
Contendrá exclusivamente el código de diseño y componentes visuales.

#### [NEW] web-portal/ (Next.js Unificado)
- Fusión de `portal-municipal` y `portal-proveedor`.
- Estructura de carpetas:
    - `src/app/admin/`: Panel de funcionario municipal.
    - `src/app/socio/`: Monitor de canjes y reportes del comercio.
    - `src/components/`: Sistema de diseño compartido (Sidebar, Botones, Tarjetas).

#### [NEW] mobile-app/ (Flutter UI)
- Migración de `app-movil`.
- Reorganización de `lib/`:
    - `lib/ui/screens/`: Solo el diseño de las pantallas.
    - `lib/ui/widgets/`: Componentes visuales reutilizables.

---

## Estrategia de Ejecución

### Fase 1: Estructura Raíz
1. Crear directorios `backend` y `frontend`.
2. Mover `app-movil` a `frontend/mobile-app`.
3. Crear un nuevo proyecto Next.js en `frontend/web-portal` o fusionar sobre el municipal.

### Fase 2: Extracción de Lógica
1. Mover lógica de cálculos y fetching de las páginas de reportes a `backend/web-logic`.
2. Crear el paquete de servicios en `backend/mobile-logic` y vincularlo al `pubspec.yaml` de la app móvil.

### Fase 3: Unificación Web
1. Mover los componentes de `portal-proveedor` al proyecto unificado en `frontend/web-portal`.
2. Configurar el sistema de rutas para diferenciar entre Admin y Socio.

## Verification Plan

### Automated Tests
- Ejecutar `flutter pub get` y `npm install` en las nuevas rutas.
- Verificar que las llamadas a Supabase sigan funcionando desde las nuevas ubicaciones de lógica.

### Manual Verification
1. Entrar al portal web y validar acceso tanto a funciones de Admin como de Socio.
2. Realizar un canje en la App Móvil y confirmar que la lógica (ahora en `backend/`) se ejecuta correctamente.
