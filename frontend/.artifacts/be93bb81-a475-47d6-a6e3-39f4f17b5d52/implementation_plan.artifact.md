# Solución Definitiva al Fondo Blanco en iOS (Modales)

Este plan aborda el persistente problema de la franja blanca al arrastrar modales en iPhone, eliminando la dependencia de componentes de sistema que se comportan de forma inconsistente en iOS con fondos transparentes.

## Proposed Changes

### 1. Refactorización de Modales en Beneficios

El problema parece originarse en la combinación de `showDragHandle: true` y `backgroundColor: Colors.transparent` en iOS, donde el área del "handle" puede pintar un fondo blanco por defecto del tema.

#### [MODIFY] [beneficios.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/beneficios.dart)
- Desactivar `showDragHandle: false` en todos los `showModalBottomSheet`.
- Agregar un indicador de arrastre manual (una pequeña barra gris) dentro del contenedor blanco para mantener la guía visual.
- Asegurar que el contenedor blanco sea el elemento raíz del modal, con bordes redondeados explícitos.
- Ajustar `clipBehavior: Clip.antiAlias` para asegurar que nada sobresalga de los bordes redondeados.
- Eliminar la propiedad `shape` del `showModalBottomSheet` para evitar conflictos con la transparencia.

---

### 2. Sincronización en Comercio

#### [MODIFY] [comercio.dart](file:///C:/Users/2266/StudioProjects/App369/frontend/app-movil/lib/comercio.dart)
- Aplicar la misma lógica de contenedor raíz con bordes redondeados y fondo transparente en la base.

## Verification Plan

### Manual Verification (iPhone)
1. Abrir cualquier modal de beneficio o comercio.
2. Deslizar hacia abajo lentamente y luego rápido.
3. Verificar que el área que queda expuesta arriba sea el fondo oscurecido de la aplicación (`barrierColor`) y **nunca** una franja blanca.
4. Confirmar que el nuevo indicador de arrastre manual sea visible y estéticamente agradable.
