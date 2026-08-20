# Correcciones de Interfaz y Ajustes de Modal

Este plan aborda los desajustes visuales reportados en el carrusel de beneficios, la superposición en la pantalla de notificaciones y la personalización del modal de beneficios.

## Proposed Changes

### [App Móvil]

#### [MODIFY] [home.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/home.dart)
- **Ajuste de Tarjeta Vertical**:
    - Se incrementó el tamaño de la imagen superior de `90` a `125` para equilibrar el diseño.
    - Se redujo el padding del título para eliminar el exceso de espacio blanco.
    - Esto asegura que el footer colorido tenga el espacio necesario y no se vea desplazado, corrigiendo el error visual en "Escuela del Valle" y otros comercios.

#### [MODIFY] [notificaciones.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/notificaciones.dart)
- **Ajuste de Margen Superior**:
    - Se aumentó el padding superior de la lista de `120` a `140`.
    - Esto soluciona la superposición de las tarjetas de notificación con el subtítulo y el botón de borrado de la AppBar.

#### [MODIFY] [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)
- **Ajuste de Imagen de Fondo en Modal**:
    - Se modificó la altura del contenedor de imagen de `200` a `240` (o el valor deseado según la preferencia de escala).
    - Se ajustó el `Positioned` del botón cerrar para mantener la coherencia con el nuevo tamaño.

## Verification Plan

### Manual Verification
1. **Home**: Verificar que "Escuela del Valle" y el resto de tarjetas del carrusel muestren el texto "Descuento" correctamente dentro del footer colorido.
2. **Notificaciones**: Confirmar que el primer ítem de la lista no tape el texto informativo ni los botones de la cabecera.
3. **Modal**: Observar el nuevo tamaño de la imagen en el detalle del beneficio y asegurar que se vea proporcional.
