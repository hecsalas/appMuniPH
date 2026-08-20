# Carga de Imágenes desde Assets en Beneficios

Este plan detalla cómo modificar el carrusel de beneficios en el Home para que soporte imágenes guardadas localmente en la carpeta de `assets`, además de las imágenes de internet.

## Proposed Changes

### [App Móvil]

#### [MODIFY] [home.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/home.dart)
- Modificar el método `_buildVerticalCard`:
    - Cambiar `Image.network` por una lógica condicional.
    - Si la URL comienza con "http", usar `Image.network`.
    - En caso contrario, usar `Image.asset`.
- Actualizar la lista de beneficios en `_buildBeneficiosPreview` para usar las rutas locales (ej: `assets/casa-guau.png`).

## Verification Plan

### Manual Verification
1. Abrir el Home.
2. Verificar que las imágenes de los comercios (Casa Guau, Clínica del Sol, etc.) se carguen correctamente usando los archivos locales.
3. Confirmar que no hay errores de "asset not found" en la consola.
