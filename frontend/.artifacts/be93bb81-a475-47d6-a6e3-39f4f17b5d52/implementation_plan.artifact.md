# Implementación de Reportes Reales en Portal Municipal

Este plan detalla la transición de la sección de Reportes de datos estáticos a una integración real con Supabase, permitiendo a los funcionarios municipales ver el impacto real del programa de beneficios.

## Proposed Changes

### [Portal Municipal]

#### [MODIFY] [ReportesPage (src/app/reportes/page.tsx)](file:///C:/Users/2266/StudioProjects/App369/frontend/portal-municipal/src/app/reportes/page.tsx)
- Implementar hooks `useState` y `useEffect` para gestionar el estado de los reportes.
- Crear una función `fetchReportData` que:
    - Consulte `solicitudes_canje` con joins a `comercios` (nombre, categoría) y `beneficios` (título).
    - Calcule dinámicamente los KPIs:
        - **Total Canjes**: Conteo total de registros.
        - **Ahorro Comunal**: Estimación basada en un promedio por canje (ya que la DB no tiene montos exactos aún).
        - **Vecinos Activos**: Conteo de nombres únicos en las solicitudes.
        - **Nuevos Comercios**: Conteo de comercios registrados recientemente.
    - Agrupe las solicitudes por categoría para el gráfico de barras.
    - Obtenga las últimas 5-10 solicitudes para la tabla de actividad reciente.
- Integrar un `Loader2` para los estados de carga.
- Mejorar la visualización de tendencias comparando con periodos anteriores (opcional/simulado según disponibilidad de fechas).

## Verification Plan

### Manual Verification
1. Navegar a la sección de **Reportes** en el portal municipal.
2. Verificar que aparezca el spinner de carga.
3. Confirmar que los números coincidan con la realidad de la base de datos (puedes verificar en el Monitor de Canjes del proveedor o directamente en Supabase).
4. Comprobar que la tabla "Últimos Canjes Realizados" muestre nombres de vecinos y comercios reales que han interactuado con la app móvil.
