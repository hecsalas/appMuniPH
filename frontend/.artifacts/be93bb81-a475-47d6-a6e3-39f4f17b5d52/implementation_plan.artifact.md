# Rediseño Inmersivo del Carrusel de Vitrineo

Este plan detalla la transición hacia un diseño de tarjeta "Full-Image", donde la fotografía del comercio ocupa todo el fondo y la información se presenta mediante superposición (overlay) en la parte inferior.

## User Review Required

> [!IMPORTANT]
> El cambio a un diseño inmersivo implica que **el texto pasará a ser blanco** para resaltar sobre el degradado oscuro. Esto maximiza el impacto visual de las fotos de los locales.

## Proposed Changes

### [App Móvil]

#### [MODIFY] [home.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/home.dart)
- **Rediseño Estructural de `_buildVerticalCard`**:
    - Cambiar la base de `Column` a un `Stack`.
    - **Capa 1 (Fondo)**: Imagen ocupando todo el ancho y alto con `BoxFit.cover`.
    - **Capa 2 (Gradiente)**: Un degradado de negro semitransparente (`0.0` a `0.8`) concentrado en el tercio inferior.
    - **Capa 3 (Información)**: Textos posicionados en la base (`bottom: 15`), alineados a la izquierda.
    - **Capa 4 (Accesorios)**: El "Badge" de descuento se mantiene arriba a la derecha.
- **Sincronización de Assets**:
    - Verificar y asegurar la ruta de `assets/odfjell.png` para corregir la visibilidad en el comercio de la viña.

#### [MODIFY] [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)
- Reforzar el mapeo de "Viña Odfjell" en `_getAssetPath` para garantizar coherencia en el modal de detalles.

---

## Verification Plan

### Manual Verification
1. **Carrusel Home**: Confirmar que la imagen llena toda la tarjeta de `200x280`.
2. **Legibilidad**: Verificar que el texto blanco sea legible sobre el degradado oscuro, incluso en imágenes claras.
3. **Imagen Odfjell**: Validar específicamente que la foto de la Viña aparezca correctamente.
4. **Resposividad**: Asegurar que en pantallas más pequeñas el diseño no genere desbordamientos (overflow).
