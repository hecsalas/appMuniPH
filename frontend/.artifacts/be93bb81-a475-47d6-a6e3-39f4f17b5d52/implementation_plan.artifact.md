# Ajustes de Diseño Responsivo para iPhone

Este plan aborda los problemas de desbordamiento y alineación detectados en dispositivos iPhone con pantallas de distintos tamaños.

## Proposed Changes

### [App Móvil]

#### [MODIFY] [home.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/home.dart)

1.  **Tarjeta Digital**:
    - Envolver el texto "TARJETA VECINO DIGITAL" en un `FittedBox` con `fit: BoxFit.scaleDown`. Esto asegurará que el título siempre permanezca en una sola línea, reduciendo su tamaño automáticamente si el ancho de la pantalla es insuficiente.

2.  **Carrusel de Beneficios**:
    - Aumentar la altura del `SizedBox` contenedor del `ListView` de `230` a **`260`**. Esto proporcionará el espacio vertical necesario para que las tarjetas rectangulares se vean completas sin cortes.

3.  **Tarjeta Vertical (Vertical Card)**:
    - **Cuerpo**: Reducir ligeramente el padding del título para ganar espacio.
    - **Footer**:
        - Mejorar el `Row` interno utilizando `Expanded` para la descripción de la izquierda, evitando que choque con el valor de la derecha.
        - Ajustar el tamaño de fuente del valor de descuento a `14` (actualmente `16`) para que el texto multilínea ("17%\nDescuento") quepa cómodamente dentro del contenedor.
        - Asegurar que el `textAlign: TextAlign.center` esté aplicado al valor.

## Verification Plan

### Manual Verification
1.  **Simulador iPhone (Varios tamaños)**:
    - Verificar que el título de la tarjeta digital no se divida en dos líneas.
    - Confirmar que las tarjetas de beneficios sean totalmente visibles de arriba a abajo.
    - Validar que el texto "Descuento" esté dentro del área coloreada del footer y no se desborde hacia afuera.
    - Comprobar que en "Escuela del Valle", el título esté correctamente centrado y no se vea desplazado hacia abajo.
