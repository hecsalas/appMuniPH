# Mejoras en Aplicación Móvil MiPH

Este plan detalla las mejoras solicitadas para la aplicación móvil, incluyendo el cambio de nombre, mejoras en la interfaz de beneficios y la corrección de errores visuales en los modales.

## User Review Required

> [!IMPORTANT]
> El cambio de nombre de la aplicación a **MiPH** afectará cómo se muestra en el menú de aplicaciones del dispositivo (Android/iOS).

## Proposed Changes

### 1. Renombrar la Aplicación a "MiPH"

#### [MODIFY] [AndroidManifest.xml](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/android/app/src/main/AndroidManifest.xml)
- Cambiar `android:label` de "app369" a "MiPH".

#### [MODIFY] [Info.plist](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/ios/Runner/Info.plist)
- Cambiar `CFBundleDisplayName` a "MiPH".
- Cambiar `CFBundleName` a "MiPH".

#### [MODIFY] [main.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/main.dart)
- Cambiar el título del `MaterialApp` a "MiPH".

---

### 2. Mejorar Botón de Cancelar en Operación de Beneficio

#### [MODIFY] [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)
- En `_iniciarProcesoCanje`, mejorar el diseño del botón "CANCELAR SOLICITUD" dentro del diálogo de espera (cuando se aguarda la confirmación del comercio).
- El botón será más prominente (usando `OutlinedButton` o `ElevatedButton` con estilo de advertencia) para que sea claramente identificable como la acción de cancelar la operación en curso.
- Se elimina la propuesta anterior de agregar una (X) de cierre en el modal de selección, manteniendo el flujo actual pero con el botón de cancelación de operación mejorado.

---

### 3. Mejorar Historial de Uso de Beneficios

#### [MODIFY] [historialBeneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/historialBeneficios.dart)
- Reemplazar los datos estáticos por una consulta real a Supabase (tabla `solicitudes_canje`).
- Implementar `RefreshIndicator` para permitir actualizar el historial.
- Mejorar el diseño de las tarjetas de historial:
    - Mostrar el nombre real del comercio y beneficio.
    - Formatear mejor la fecha.
    - Usar colores de estado más vibrantes.

---

### 4. Corregir Error Visual en Modal de Beneficio

#### [MODIFY] [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)
- En `_mostrarDetallesBeneficio` y `_mostrarSolicitudBeneficio`:
    - Agregar `showDragHandle: true` para que el usuario sepa que puede arrastrar.
    - Ajustar el `barrierColor` para que el fondo se oscurezca correctamente.
    - Asegurar que el contenido del modal respete los bordes redondeados y no deje espacios en blanco al ser arrastrado parcialmente.

## Verification Plan

### Manual Verification
1. **Renombrado**: Verificar que el nombre "MiPH" aparezca bajo el ícono de la app en Android e iOS.
2. **Botón Cancelar**: Iniciar el proceso de canje de un beneficio y verificar que los botones de cancelación sean claros y funcionales.
3. **Historial**: Abrir la página de historial y verificar que cargue datos reales de Supabase con el nuevo diseño.
4. **Modal**: Abrir el detalle de un beneficio, arrastrarlo hacia abajo y verificar que no se vea una franja blanca extraña en la parte superior.
