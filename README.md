# YouTube TV (versión tauri)

YouTube TV está originalmente escrito en Typescript, usando el entorno de ejecución de Nodejs con el framework Electron. Esta pila requiere una capacidad de memoria RAM bastante alta, en su lugar se ha considerado la opción de usar tauri que aprovecha el motor webview nativo del sistema para optimizar estos recursos.

Adicionalmente, dado que el motor de renderizado ya viene incluído en el sistema operativo, el uso de una instancia independiente de chromium es innecesaria, lo que también implica un menor consumo de almacenamiento local en el equipo.

## Consideraciones

- La aplicación original usa [peer-dial](https://www.npmjs.com/package/peer-dial) para la conexión entre dispositivos móviles (o navegadores) con el cliente de YouTube TV. Esto permitía controlar remotamente la aplicación para reproducir contenido sin tener que buscarlo manualmente en esta.\
Esto no es posible por el momento con tauri, ya que parece no existir ningún paquete similar en crate, se debería escribir una implementación manualmente, lo que conlleva un tiempo considerable, habría que estudiar el funcionamiento del protocolo DIAL.
- Ya que el motor de renderizado lo aporta el sistema operativo, en principio parece no ser necesaria ninguna firma de stream para el DRM, esto permite deshacerse de electron-castlabs, sin embargo no se ha probado en macOS ni Linux, donde este último tenía la limitación por no encontrarse disponible.

## Compilación

Para compilar YouTube TV se ha dejado preparado algunos scripts, se puede localizar en el fichero ```package.json```.

Aparentemente se puede realizar compilaciones cruzadas, en mi caso personal, ahora uso un dispositivo Arm64 con Windows 11 y he logrado compilar para x64.

[Este sitio](https://www.mobzystems.com/blog/tauri-20-cross-compilation/) contiene una pequeña guía bastante sencilla que me ha ayudado a preparar el entorno para realizar las compilaciones.

Resumidamente los pasos son los siguientes:

1. Comprobar si el paquete de la compilación objetivo está instalado: `rustup target list`
2. Añadir un paquete: `rustup target add ...`
3. Compilar para la plataforma y arquitectura instalada: `npm run tauri build -- -- --target ...`

Por ejemplo, en mi caso para realizar una compilación para arquitectura x64 sobre arm64:

```
rustup target add x86_64-pc-windows-msvc
npm run tauri build -- -- --target x86_64-pc-windows-msvc
```
**NOTA:**
Para añadir un nuevo script al `package.json`, se debe eliminar la parte `-- -- `, de lo contrario al usar `npm run` se producirá el siguiente error:
```

Info Looking up installed tauri packages to check mismatched versions...
error: unexpected argument '--target' found

Usage: cargo.exe build [OPTIONS]

For more information, try '--help'.
failed to build app: failed to build app
       Error failed to build app: failed to build app
```

En Windows 11 ARM, el binario x64 corre sin problemas, pero en x64, el binario ARM no puede ejecutarse.

Como requisito previo, se debe instalar los paquetes de compilación de Visual Studio correspondientes a cada arquitectura.

## Notas adicionales

Esto es una prueba rápida y experimental, se trata de un primer "boceto" para comprobar las capacidades. La implementación es mínima y primitiva, únicamente funciona lo básico que es la reproducción del contenido tal y como lo hacía YouTube TV original en sus primeras versiones, no dispone de conexión remota con el protocolo DIAL, no está disponible la configuración adicional de la que disponía YouTube TV en las últimas versiones ni los scripts que se inyectaban para mejorar en cierta medida la experiencia de usuario.
