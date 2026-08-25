# Plan para Eliminar Carpetas Duplicadas

Tras revisar la estructura del proyecto y el directorio de proyectos (`StudioProjects`), he identificado varias carpetas que parecen ser duplicados, versiones anteriores o archivos temporales.

## Hallazgos de Investigación

He encontrado las siguientes carpetas fuera del proyecto actual que parecen ser duplicadas o versiones obsoletas:
1.  `C:/Users/2266/StudioProjects/app_3`: Una versión anterior del proyecto (creada en julio).
2.  `C:/Users/2266/StudioProjects/app_5`: Otra versión anterior (creada en julio/agosto).
3.  `C:/Users/2266/StudioProjects/app369.f42e1644`: Una carpeta que solo contiene archivos temporales (`.artifacts`).

Dentro del proyecto actual (`App369`), he encontrado archivos redundantes en la raíz que normalmente solo deberían estar dentro de la carpeta del app móvil:
1.  `App369/.dart_tool` (ya existe en `App369/frontend/mobile-app/.dart_tool`)
2.  `App369/.flutter-plugins-dependencies` (ya existe en `App369/frontend/mobile-app/.flutter-plugins-dependencies`)

## Preguntas Abiertas

> [!IMPORTANT]
> ¿Deseas que elimine las carpetas de versiones anteriores (`app_3` y `app_5`) y la carpeta temporal (`app369.f42e1644`)?
>
> ¿Deseas que limpie los archivos redundantes en la raíz de `App369` (`.dart_tool` y `.flutter-plugins-dependencies`)?

## Cambios Propuestos

### [Limpieza de Directorio de Proyectos]

#### [DELETE] [app_3](file:///C:/Users/2266/StudioProjects/app_3)
#### [DELETE] [app_5](file:///C:/Users/2266/StudioProjects/app_5)
#### [DELETE] [app369.f42e1644](file:///C:/Users/2266/StudioProjects/app369.f42e1644)

### [Limpieza de Raíz del Proyecto App369]

#### [DELETE] [.dart_tool](file:///C:/Users/2266/StudioProjects/App369/.dart_tool)
#### [DELETE] [.flutter-plugins-dependencies](file:///C:/Users/2266/StudioProjects/App369/.flutter-plugins-dependencies)

## Plan de Verificación

### Verificación Manual
- Confirmar que el proyecto actual (`App369/frontend/mobile-app`) sigue funcionando correctamente tras la limpieza.
- Verificar que el espacio en disco se haya liberado.
