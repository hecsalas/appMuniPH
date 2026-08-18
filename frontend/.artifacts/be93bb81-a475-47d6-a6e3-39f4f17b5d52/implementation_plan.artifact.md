# Configuración de Ejecución en Android Studio

Este plan detalla los pasos para configurar correctamente el proyecto en Android Studio, permitiendo que reconozca la aplicación Flutter que se encuentra en la subcarpeta `app-movil`.

## Problema detectado
Android Studio muestra "Add Configuration" porque el proyecto principal se abrió desde la raíz (`frontend`), pero la aplicación Flutter está un nivel más abajo en `app-movil`. El IDE no ha detectado automáticamente el punto de entrada `main.dart`.

## Instrucciones para el Usuario

Para solucionar esto manualmente en la interfaz de Android Studio, siga estos pasos:

1. Haga clic en el desplegable que dice **"Add Configuration..."** en la barra de herramientas superior (junto al botón de Play).
2. En la ventana que aparece, haga clic en el botón **"+"** (arriba a la izquierda) y seleccione **"Flutter"**.
3. En el campo **Name**, escriba: `App MiPH`.
4. En el campo **Dart entrypoint**, haga clic en la carpeta y busque la ruta:
   `C:\Users\2266\StudioProjects\App369\frontend\app-movil\lib\main.dart`
5. Asegúrese de que el **Working directory** apunte a:
   `C:\Users\2266\StudioProjects\App369\frontend\app-movil`
6. Haga clic en **OK**.

> [!TIP]
> Una vez configurado, el icono del rayo (Hot Reload) y el botón de Play funcionarán cada vez que guarde con **Ctrl + S**.

## Proposed Changes

### [Configuración del IDE]

No se realizarán cambios directos en los archivos de código fuente, ya que las configuraciones de ejecución (`runConfigurations`) en Android Studio suelen guardarse en archivos locales del usuario (`workspace.xml`) o requieren interacción con la interfaz para que el plugin de Flutter se active correctamente.

## Verification Plan

### Manual Verification
1. Verificar que el botón de Play esté habilitado.
2. Ejecutar la aplicación en el emulador.
3. Realizar un cambio pequeño en un texto y presionar **Ctrl + S** para confirmar que el Hot Reload funciona.
