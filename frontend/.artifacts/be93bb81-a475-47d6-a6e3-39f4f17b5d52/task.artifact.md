# Tareas: Solución iOS y Lógica QR

- [x] Modificar `_mostrarDetallesBeneficio` en `beneficios.dart`
    - [x] Agregar parámetro `isFromQR`
    - [x] Refactorizar estructura visual para iOS (Handle integrado en Header)
    - [x] Implementar visibilidad condicional del botón "Solicitar"
- [x] Actualizar llamadas a `_mostrarDetallesBeneficio`
    - [x] En `_abrirModalPorTitulo` (pasar `isFromQR: true`)
    - [x] En la lista de beneficios (pasar `isFromQR: false`)
- [/] Mejorar `_mostrarSolicitudBeneficio` para iOS
    - [ ] Agregar `ClampingScrollPhysics` a la lista
- [ ] Verificar consistencia visual en Android e iOS
