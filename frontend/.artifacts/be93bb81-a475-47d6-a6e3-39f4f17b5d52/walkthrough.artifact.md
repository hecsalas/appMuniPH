# Integración de Imágenes en Modal de Beneficios

Se ha mejorado la experiencia visual del vecino integrando imágenes locales (assets) en la cabecera del modal de detalles de cada comercio.

## Cambios Realizados

### [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)

#### 🗺️ Mapeo Inteligente de Assets
- Se implementó la función `_getAssetPath` que vincula automáticamente el nombre del comercio con su imagen correspondiente guardada en la carpeta `assets/`.
- Soporta coincidencias parciales y variaciones de nombres (ej: "Casa Guau", "Clínica del Sol", "Farmacia Trébol", etc.).

#### 🖼️ Cabecera Visualmente Atractiva
- **Imagen Protagonista**: El color sólido del encabezado fue reemplazado por la imagen real del comercio o beneficio.
- **Filtro de Contraste**: Se aplicó un filtro `BlendMode.darken` sobre la imagen para asegurar que el botón de cerrar (X) y el indicador de arrastre sean perfectamente visibles.
- **Fallback Automático**: Si un comercio no tiene una imagen asociada, el sistema muestra automáticamente el color y el icono de su categoría, manteniendo la elegibilidad.

#### 📱 Refinamiento de Interfaz en iPhone
Se ha implementado una solución definitiva para el área superior de los modales.
- **Handle Flotante**: El indicador de arrastre ahora es semitransparente (`opacity: 0.5`) y flota directamente sobre la imagen de cabecera. Esto elimina la necesidad de un contenedor sólido arriba y permite que la imagen del comercio brille desde el primer píxel.
- **Efecto Seamless**: Al unificar el contenido en un `Stack`, el desplazamiento en iOS se siente mucho más natural y desaparece cualquier rastro de franjas blancas.

### 🍦 Nueva Promoción Destacada
Se integró al carrusel de vitrineo la nueva oferta de la Heladería MiPH:
- **Oferta**: Al comprar un barquillo doble, el vecino obtiene un 3er sabor, topping o crema **GRATIS**.
- **Diseño**: Se utilizó un color rosa vibrante y una imagen temática para captar la atención.

## Verificación

- [x] Las imágenes cargan correctamente para los comercios definidos.
- [x] El degradado permite leer los iconos blancos sobre cualquier imagen.
- [x] El modal se siente como una sola pieza visual al arrastrarlo.
