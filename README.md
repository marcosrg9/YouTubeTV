#  YouTube TV

Cliente de YouTube TV sencillo para escritorio basado en electron.

Usa el siguiente userAgent:
```
Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754
```

Para lanzar la aplicación basta con usar el comando ```npm start```.

## 🛠️ Compilar
El proyecto se puede compilar para varias plataformas diferentes, así como arquitecturas de 32, 64 bits y ARM.

Hay comandos preparados para compilarlo:

**Windows x32**
```
npm run buildWin32
```
**Windows x64**
```
npm run buildWin64
```
**Windows ARM**
```
npm run buildWinARM
```
**Linux x32**
```
npm run buildLinux32
```
**Linux x64**
```
npm run buildLinux64
```
**Linux ARM64**
```
npm run buildLinuxARM64
```
**Linux ARMv7**
```
npm run buildLinuxARMv7
```
**macOS x64**
```
npm run buildmOS64
```
Compilar para macOS puede dar fallos de permisos desde Windows.

**Todas las plataformas y arquitecturas**
```
npm run buildAll
```

⚠️ Los scripts anteriores compilan el proyecto con el argumento ```--asar``` para ocultar el código fuente.
Para compilar sin este argumento deberá lanzar el comando personalizado desde la línea de comandos.

```
electron-packager ./ YouTube-TV --platform=#PLATAFORMA# --arch=#ARQUITECTURA#
```
Plataformas disponibles:
- win32
- linux
- darwin
- mas (no usado, solo para macOS App Store)

Arquitecturas disponibles:
- ia32 (x32/x86)
- x64
- armv7l
- arm64

Ejemplo de uso para Raspberry:

```
electron-packager ./ 'YouTube TV' --platform=linux --arch=armv7l
```
Una vez compilado, puede acceder y manipular el código fuente desde la carpeta **resources**.

>⚠️ Si compila para varias plataformas sin usar el script ```buildAll``` procura sacar cualquier build de la carpeta del proyecto, si no lo hace, el resto de paquetes se añadirán al proyecto compilado, aumentando de esta forma el tamaño inutilmente.
Por ejemplo, si compila una versión para Windows y después otra para Linux, saca la carpeta del proyecto y compila la siguiente versión.

Para cambiar otros parámetros puede seguir la guía de [electron packager](https://github.com/electron/electron-packager#usage).

## 📺 Kiosk mode
Para alternar entre el modo ventana y kiosko se puede pulsar la tecla F11.

También se puede forzar desde la instancia a BrowserWindow:
```Javascript
let win = new BrowserWindow({
        width: 1230,
        height: 720,
        kiosk: true,
        title: 'YouTube TV',
```
Sin embargo forzar este modo impide cambiar a otras ventanas de forma sencilla.

## ⛔ Problemas conocidos (menores)
- Al minimizar la ventana, la reproducción se detiene. Se puede reanudar si hay un dispositivo enlazado pulsando el botón de reproducir desde YouTube.
- En la primera ejecución de la aplicación, desde la pantalla de inicio de sesión, no se puede lanzar el modo kiosko.

- Las restricciones de DRM impiden visualizar contenido en resolución HD y superior. Eventualmente, la opción HD se habilitará, pero el contenido en FHD y superior seguirá siendo restringido. Este problema no se puede corregir, al menos de momento.

## ⚙️ Tests

- ✔️ Windows 10 x64 - win32_x64/ia32.
- ✔️ Ubuntu 19.04 x64 (VM) - linux_x64.
- ✔️ Rasbian 10 Buster (Raspberry Pi4) - linux_armv7l.
- ✔️ macOS 11 Big Sur (macbook air) - darwin (comprobado por [Mateo Fortea](https://github.com/mfortea)).

No comprobado en Windows ni macOS para plataformas ARM. 

## 📦 Builds
El proyecto se puede descargar compilado y listo para su uso. Disponible para Linux, macOS y Windows.

[Todas las builds](https://github.com/marcosrg9/YouTubeTV/releases/latest)

**Licencia Creative Commons**

![CC-BY-NC-SA](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.eu.svg)