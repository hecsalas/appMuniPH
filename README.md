# MiPH - Mi Padre Hurtado 🇨🇱

[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**MiPH (Mi Padre Hurtado)** es una solución integral diseñada para fortalecer la conexión entre la Municipalidad de Padre Hurtado, sus vecinos y el comercio local. El sistema permite la gestión y el canje de beneficios sociales mediante una experiencia digital moderna y segura.

---

## 🏗️ Arquitectura del Proyecto

El repositorio está organizado como un monorepo que contiene tanto el cliente móvil como los portales de gestión web.

```text
App369/
├── backend/                # Lógica central y base de datos
│   ├── database/           # Esquemas SQL y migraciones
│   ├── mobile-logic/       # Servicios compartidos para la App
│   └── web-logic/          # Servicios compartidos para la Web
├── frontend/
│   ├── mobile-app/         # Aplicación móvil (Flutter)
│   └── web-portal/         # Portal Admin y Socio (Next.js)
└── README.md               # Documentación principal
```

---

## 🚀 Componentes del Sistema

### 1. Aplicación Móvil (`frontend/mobile-app`)
Interfaz principal para los vecinos, desarrollada con **Flutter 3.12+**.
- **Catálogo de Beneficios**: Visualización de comercios asociados y sus convenios.
- **Canje Digital**: Sistema basado en códigos QR para validación instantánea.
- **Botón SOS**: Acceso directo a servicios de emergencia comunales.
- **Perfil del Vecino**: Gestión de datos y consulta de historial de beneficios.

### 2. Portal de Gestión (`frontend/web-portal`)
Plataforma administrativa unificada desarrollada en **Next.js 15** con **Tailwind CSS**.
- **Módulo Administrador**: Gestión de comercios, sucursales y auditoría de beneficios.
- **Módulo Socio/Comercio**: Dashboard para que locatarios validen canjes y vean estadísticas.
- **Reportes Avanzados**: Generación de reportes en Excel sobre el impacto de los beneficios.

### 3. Backend & Base de Datos (`backend/`)
Potenciado por **Supabase**, proporcionando una infraestructura escalable y en tiempo real.
- **Autenticación**: Manejo seguro de sesiones para vecinos y socios.
- **Base de Datos**: PostgreSQL con políticas de seguridad a nivel de fila (RLS).
- **Storage**: Almacenamiento de logotipos y recursos visuales.

---

## ⚙️ Configuración y Ejecución

### Requisitos Previos
- **Flutter SDK** (^3.12.2)
- **Node.js** (v18+)
- **Supabase Project**: Acceso a la URL y Anonymous Key.

### Guía de Inicio Rápido

#### Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/App369.git
cd App369
```

#### Ejecutar App Móvil
```bash
cd frontend/mobile-app
flutter pub get
flutter run
```

#### Ejecutar Portal Web
```bash
cd frontend/web-portal
npm install
npm run dev
```

---

## 🛠️ Stack Tecnológico

- **Lenguajes:** Dart, TypeScript.
- **Frameworks:** Flutter (Material 3), Next.js (App Router).
- **Estilos:** Tailwind CSS, Lucide React, FontAwesome.
- **Base de Datos:** PostgreSQL (vía Supabase).
- **Integraciones:** Google Maps API, Mobile Scanner, QR Flutter.

---
Desarrollado para la comunidad de Padre Hurtado. 🚀
