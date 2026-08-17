# Solución al Problema Visual en iPhone

Se ha implementado una solución definitiva para eliminar la franja blanca que aparecía al arrastrar los modales hacia abajo en iOS.

## Cambios Realizados

### Refactorización de Modales
El problema principal era que el `showDragHandle: true` de Material 3 forzaba un fondo blanco en el área superior del modal en iOS, ignorando la transparencia de la base.

1.  **Eliminación de Handle Automático**: Se desactivó `showDragHandle` en todos los modales de la aplicación para evitar que el sistema iOS pinte fondos indeseados.
2.  **Indicador Manual**: Se agregó una barra de arrastre personalizada (`Container` gris de 40x5px) directamente dentro del contenedor blanco del modal. Esto asegura que la guía visual exista pero sea parte de nuestro diseño controlado.
3.  **Transparencia y Recorte**:
    - Se mantuvo `backgroundColor: Colors.transparent` en la base del modal.
    - Se agregó `clipBehavior: Clip.antiAlias` al contenedor blanco para asegurar que los bordes redondeados sean perfectos durante el movimiento.
    - Se eliminó cualquier propiedad `shape` externa que pudiera causar conflictos de renderizado en Apple.

### Archivos Modificados
- [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart): Actualizados modales de detalles y solicitud de beneficios.
- [comercio.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/comercio.dart): Actualizado el modal de detalles de comercios en el mapa.

## Verificación

- [x] Verificado que no exista franja blanca al arrastrar hacia abajo en iPhone.
- [x] El indicador de arrastre ahora es consistente en todas las pantallas.
- [x] Los bordes redondeados se mantienen nítidos durante la animación.
