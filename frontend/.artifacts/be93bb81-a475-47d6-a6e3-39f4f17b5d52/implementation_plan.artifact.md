# Solución Definitiva iOS y Mejora de Flujo QR

Este plan aborda el error visual en iPhone y restringe la solicitud de beneficios exclusivamente al flujo de escaneo QR.

## User Review Required

> [!IMPORTANT]
> A partir de este cambio, los vecinos ya no verán el botón "SOLICITAR BENEFICIO" al navegar manualmente por el catálogo. Solo podrán activarlo si llegan a la pantalla mediante un escaneo de código QR.

## Proposed Changes

### 1. Solución Definitiva Fondo Blanco iOS

El problema del fondo blanco en iPhone ocurre porque el contenido (scrollable) se desliza, pero el "lienzo" del modal se queda estático o rebota de forma distinta.

#### [MODIFY] [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)
- Modificar `_mostrarDetallesBeneficio`:
    - Quitar el `Column` que separaba el handle del contenido.
    - Poner el **indicador de arrastre manual** directamente como el primer elemento de la lista scrolleable o dentro de un `Stack` que cubra todo el modal.
    - La mejor solución para iOS es que **todo** (incluyendo el color de fondo superior) esté dentro de un solo contenedor que se desplace unido.

---

### 2. Restricción de Solicitud (Solo QR)

#### [MODIFY] [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)
- Añadir un parámetro booleano `isFromQR` a `_mostrarDetallesBeneficio`.
- En el `onTap` de la lista normal de beneficios, pasar `isFromQR: false`.
- En `_abrirModalPorTitulo` (cuando se viene de un QR), pasar `isFromQR: true`.
- En el diseño del modal, envolver el botón "SOLICITAR BENEFICIO" en un condicional `if (isFromQR)`.

## Verification Plan

### Manual Verification
1. **iPhone**: Abrir detalle de beneficio, deslizar hacia abajo y confirmar que no existe separación visual entre el handle y el resto del contenido.
2. **Browsing**: Entrar a la app, ir a beneficios, abrir cualquier comercio y verificar que **NO** aparezca el botón de solicitar.
3. **QR**: Simular un escaneo (usando un deep link o el scanner), verificar que el modal se abra automáticamente y que **SÍ** aparezca el botón de solicitar.
