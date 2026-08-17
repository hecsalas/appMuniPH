# Corrección de Modales en iOS (Gap Blanco al Arrastrar)

Este plan detalla las correcciones necesarias para evitar que aparezca un fondo blanco indeseado cuando se arrastran los modales (bottom sheets) hacia abajo en dispositivos iOS (iPhone).

## Proposed Changes

### 1. Estandarización de `showModalBottomSheet`

El problema principal en iOS ocurre cuando el `backgroundColor` del modal no es transparente, lo que hace que el fondo propio del modal se quede "atrapado" o sea visible durante el efecto de rebote (rubber-banding) de iOS.

#### [MODIFY] [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)
- Cambiar `backgroundColor: Colors.white` por `Colors.transparent` en `_mostrarSolicitudBeneficio`.
- Asegurar que `elevation: 0` esté presente para evitar sombras extrañas durante el arrastre.
- Envolver el contenido de `_mostrarSolicitudBeneficio` en un `Container` con fondo blanco y bordes redondeados para que el diseño se mantenga igual pero el "lienzo" del modal sea invisible.

#### [MODIFY] [comercio.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/comercio.dart)
- Asegurar que el modal de detalles de comercio también use `backgroundColor: Colors.transparent` y tenga una estructura limpia.

---

### 2. Mejora del Drag Handle (Opcional pero recomendado)

Si el `showDragHandle: true` de Material 3 sigue causando problemas visuales en iOS al estar sobre un fondo transparente, se reemplazará por un indicador manual dentro del contenedor blanco. Por ahora, intentaremos primero con la transparencia total del modal.

## Verification Plan

### Manual Verification (iPhone/iOS)
1. Abrir el detalle de un beneficio.
2. Arrastrar el modal hacia abajo con un gesto rápido.
3. Verificar que el fondo que se revela arriba sea el color de la barrera (oscurecido) y no una franja blanca.
4. Repetir para el selector de beneficios y el mapa de comercios.
