# Refinamiento Estético del Handle en Modales de Beneficios

Este plan detalla la reestructuración visual del modal de detalles para que el indicador de arrastre (handle) sea semitransparente y flote directamente sobre la imagen de cabecera, logrando un diseño más moderno y fluido.

## Proposed Changes

### [App Móvil]

#### [MODIFY] [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)
- **Refactorización de `_mostrarDetallesBeneficio`**:
    - Cambiar la estructura de `Column` (que separaba el handle del contenido) por un `Stack`.
    - El primer hijo del `Stack` será el `SingleChildScrollView` con todo el contenido, permitiendo que la imagen llegue hasta el borde superior del modal.
    - El segundo hijo será el **Handle Manual** posicionado de forma absoluta en la parte superior central.
- **Ajustes Visuales**:
    - Configurar el handle con `Colors.white.withOpacity(0.5)` para que sea traslúcido.
    - Ajustar la posición del botón "Cerrar" (X) para que no interfiera con el área táctil del handle.
    - Asegurar que la imagen de cabecera mantenga el `colorFilter` para garantizar la visibilidad del handle blanco.

## Verification Plan

### Manual Verification
1. Abrir el detalle de un beneficio con imagen (ej: Casa Guau).
2. Verificar que la imagen comience desde el borde superior curvo del modal.
3. Confirmar que el handle gris/blanco semitransparente sea visible sobre la imagen.
4. Deslizar el modal hacia abajo y verificar que el movimiento sea fluido y no existan franjas blancas en la parte superior.
