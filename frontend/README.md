# MiPH - Mi Padre Hurtado

## 🏗️ Arquitectura del Sistema

### 1. Aplicación Móvil (`/app-movil`)
Desarrollada en **Flutter**, es la interfaz principal para los vecinos de la comuna.
- **Beneficios**: Visualización de catálogo dinámico de descuentos y convenios.
- **Canje Digital**: Solicitud de beneficios mediante escaneo de códigos QR.
- **SOS**: Acceso rápido a servicios de emergencia.
- **Historial**: Seguimiento personal de beneficios utilizados.

### 2. Portal Municipal (`/portal-municipal`)
Plataforma web desarrollada en **Next.js** para funcionarios municipales.
- **Gestión de Convenios**: Administración completa de comercios y beneficios.
- **Reportes**: Tablero de control con estadísticas reales sobre el impacto económico y social en la comuna.
- **Auditoría**: Monitorización de solicitudes de canje y actividad de socios.

### 3. Portal Socio / Proveedor (`/portal-proveedor`)
Portal web en **Next.js** exclusivo para los dueños de comercios.
- **Monitor de Canjes**: Recepción y validación en tiempo real de solicitudes de vecinos.
- **Estadísticas Propias**: Visualización del alcance de sus beneficios en la comunidad.
- **Gestión de Sucursales**: Información de contacto y horarios de atención.

## ⚙️ Instrucciones de Ejecución

### Requisitos Previos
- Flutter SDK (v3.12+)
- Node.js (v18+)
- Cuenta de Supabase con las tablas configuradas.

### Ejecución Local

**App Móvil:**
```bash
cd app-movil
flutter pub get
flutter run
```

**Portales Web:**
```bash
cd portal-municipal # o portal-proveedor
npm install
npm run dev
```

---
Desarrollado para la comunidad de Padre Hurtado. 🇨🇱
