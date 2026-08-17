# Mejoras en Flujo QR y Experiencia en iOS

Se han implementado cambios críticos para mejorar la navegación y corregir errores visuales específicos de dispositivos iPhone.

## Cambios Realizados

### 🔒 Restricción de Solicitud de Beneficio (Solo QR)
Se ha modificado la lógica de negocio para evitar solicitudes accidentales o fraudulentas fuera del establecimiento.
- **Lógica de Origen**: El botón **"SOLICITAR BENEFICIO"** ahora solo es visible si el usuario llega al detalle del comercio mediante el escaneo de un código QR oficial.
- **Navegación normal**: Al explorar el catálogo de beneficios desde la aplicación, el vecino verá toda la información y ubicación, pero no podrá activar el canje hasta estar en el local.

### 📱 Solución Definitiva al Fondo Blanco en iOS
Se ha rediseñado la estructura técnica de los modales para eliminar la franja blanca persistente al arrastrar en iPhone.
- **Encabezado Unificado**: El indicador de arrastre (handle) y el bloque de color superior ahora forman una sola pieza visual. Al deslizar el modal hacia abajo, el color se mantiene consistente desde el borde superior.
- **Control de Scroll**: Se aplicó `ClampingScrollPhysics` a las listas internas. Esto desactiva el "rebote" elástico interno de las listas que causaba que el contenido se separara de los bordes del modal.
- **Transparencia Real**: Se eliminaron conflictos entre las propiedades `shape` del sistema y los bordes redondeados manuales.

## Archivos Modificados
- [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart): Implementación de lógica de origen y rediseño de modales.

## Verificación

- [x] **Prueba QR**: Verificado que al simular un escaneo, el botón de solicitar aparece correctamente.
- [x] **Prueba Navegación**: Verificado que al abrir un beneficio desde la lista, el botón de solicitar está oculto.
- [x] **Prueba iOS**: Verificado que el modal se deslice como una sola pieza sólida sin mostrar el fondo blanco.
