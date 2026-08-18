# Implementación de Tarjeta Vecino Digital en Home

Se ha rediseñado la sección de inicio agregando una tarjeta de identificación digital para el vecino.

## Cambios Realizados

### [MODIFY] [home.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/home.dart)
- **Tarjeta Horizontal**: Se implementó el método `_buildDigitalCard` que organiza la información del vecino de forma horizontal.
- **Información a la Izquierda**: Nombre, ID vecinal y un badge de estado "VECINO ACTIVO" con iconos de Material.
- **QR a la Derecha**: Se integró un código QR compacto en el extremo derecho de la tarjeta utilizando `QrImageView`.
- **Estilo Moderno**: Uso de gradientes suaves, bordes redondeados (`borderRadius: 25`) y sombras para dar profundidad.

## Verificación

- [x] El código QR es visible y está alineado a la derecha.
- [x] El nombre y el ID se muestran claramente a la izquierda.
- [x] La tarjeta respeta el diseño responsivo de la aplicación.
