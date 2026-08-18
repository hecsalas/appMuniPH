# Refinamiento de Tarjeta Vertical de Beneficios

Este plan detalla el rediseño de las tarjetas del carrusel de beneficios para ofrecer una experiencia de "vitrineo" más visual y detallada, incluyendo imágenes y datos de descuentos específicos.

## Proposed Changes

### [App Móvil]

#### [MODIFY] [home.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/home.dart)
- Rediseñar el método `_buildVerticalCard` para incluir:
    - **Cabecera**: Un `ClipRRect` con una `Image` (usaremos imágenes de ejemplo de red o locales) que ocupe la parte superior.
    - **Cuerpo (Centro)**: Un área de texto para el título descriptivo del comercio o beneficio.
    - **Pie de Tarjeta (Footer)**: Un `Row` que distribuya la información en los extremos:
        - Izquierda: Nombre del descuento (ej: "Gasco").
        - Derecha: Valor o porcentaje (ej: "15% DCTO" o "$2.000").
- Ajustar las dimensiones de la tarjeta (aprox. 160x240) para acomodar la nueva estructura sin que se vea apretado.
- Actualizar la lista de datos de ejemplo en `_buildBeneficiosPreview` para incluir las URL de imágenes y los valores de descuento.

## Verification Plan

### Manual Verification
1. Abrir la pestaña de Inicio.
2. Verificar que cada tarjeta en el carrusel muestre su imagen en la parte superior.
3. Confirmar que el título esté centrado verticalmente en el espacio disponible.
4. Asegurar que el nombre del descuento a la izquierda y el valor a la derecha estén alineados correctamente en el footer.
5. Comprobar que el scroll horizontal siga funcionando de manera fluida.
