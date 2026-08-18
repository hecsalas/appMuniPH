# Ajustes Responsivos para iPhone

Se han aplicado optimizaciones de diseño para garantizar que la interfaz se adapte correctamente a distintos tamaños de pantalla en dispositivos iOS.

## Cambios Realizados

### [home.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/home.dart)

#### 💳 Tarjeta Vecino Digital
- **Título Protegido**: Se envolvió "TARJETA VECINO DIGITAL" en un `FittedBox`. Esto evita que el texto se rompa en dos líneas en pantallas angostas, reduciendo su escala automáticamente.

#### 🛍️ Carrusel de Beneficios
- **Mayor Altura**: Se incrementó el contenedor de `230` a `260` píxeles para asegurar que las tarjetas rectangulares se desplieguen completas sin importar el ratio de aspecto de la pantalla.

#### 🎴 Tarjeta Vertical (Optimización de Espacio)
- **Título Compacto**: Se redujeron los márgenes blancos alrededor del título y se ajustó la altura de línea (`height: 1.1`) para un aspecto más denso y profesional.
- **Imagen Protagonista**: Se aumentó el alto de la imagen a `125` para equilibrar la reducción de espacio del título.
- **Footer Escalonado**:
    - El nombre del descuento se ubica en la esquina superior izquierda del footer.
    - El valor (porcentaje o monto) se alinea a la esquina inferior derecha.
    - Se aumentó el tamaño del valor a `18` para un impacto visual máximo.

## Verificación

- [x] Título de tarjeta digital en una sola línea.
- [x] Tarjetas de beneficios visibles al 100% verticalmente.
- [x] Footer sin desbordamientos en textos de "Descuento".
