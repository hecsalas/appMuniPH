# Carrusel de Vitrineo en Home

Se ha implementado una nueva sección de beneficios con un diseño de carrusel horizontal para facilitar la exploración visual de ofertas.

## Cambios Realizados

### [MODIFY] [home.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/home.dart)

#### 🛍️ Carrusel de Beneficios
- **Desplazamiento Horizontal**: Se implementó un `ListView` horizontal que permite deslizar las tarjetas hacia la izquierda y derecha.
- **Efecto Vitrineo**: Se configuró con `BouncingScrollPhysics` para un rebote natural al final de la lista.

#### 🎴 Tarjeta Vertical Detallada
- **Imagen con Recorte**: La parte superior incluye una imagen ilustrativa con bordes redondeados (`ClipRRect`).
- **Título Centrado**: El nombre del beneficio se ubica en el centro de la tarjeta con soporte para múltiples líneas.
- **Footer de Información Dual**:
    - **Izquierda**: Muestra el rubro o tipo de descuento en mayúsculas.
    - **Derecha**: Destaca el valor o porcentaje del descuento (ej: "15% OFF", "$5.000").
- **Estética**: Las tarjetas son más altas que anchas (180x250 aprox), con sombras profundas para resaltar sobre el fondo.

## Verificación

- [x] El scroll horizontal funciona correctamente.
- [x] Las imágenes se cargan y respetan el redondeado superior.
- [x] Los textos en el footer están correctamente alineados a los extremos.
