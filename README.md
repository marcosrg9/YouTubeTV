#  YouTube TV

Cliente de YouTube TV sencillo para escritorio basado en electron. Puede conectar un dispositivo compatible, como un teléfono o un equipo con Google Chrome y enviar los vídeos a la aplicación para visualizarlos.

Implementa un servidor [DIAL](https://en.wikipedia.org/wiki/Discovery_and_Launch) (basado en SSDP) para permitir la conexión con dispositivos que usan este protocolo (limitado a YouTube).

Usa el siguiente userAgent:
```
Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754
```

Para lanzar la aplicación basta con usar el comando ```npm start``` o ```electron .``` en caso de que se encuentre instalado de forma global.


## 📦 Builds
El proyecto se puede descargar compilado y listo para su uso. Disponible para Linux, macOS y Windows. En arquitecturas x86, x64 y ARM.

[Todas las builds](https://github.com/marcosrg9/YouTubeTV/releases/latest)

## ⌨️ Atajos de teclado
- Pantalla completa (kiosk mode): Ctrl+F.
- Developer Tools: Ctrl+D.


## 📺 Kiosk mode
Para alternar entre el modo ventana y kiosko se puede pulsar el atajo de teclado Ctrl+F.

También se puede forzar desde la instancia a BrowserWindow:
```Javascript
let win = new BrowserWindow({
        width: 1230,
        height: 720,
        kiosk: true,
        title: 'YouTube TV',
```
Sin embargo forzar este modo impide cambiar a otras ventanas de forma sencilla.

## ⛔ Problemas conocidos
- Al minimizar la ventana, la reproducción se detiene. Se puede reanudar si hay un dispositivo enlazado pulsando el botón de reproducir desde YouTube.
- En la primera ejecución de la aplicación, desde la pantalla de inicio de sesión, no se puede lanzar el modo kiosko.

- Parece que las restricciones de DRM impiden visualizar contenido en resolución HD y superior. Eventualmente, la opción HD se habilitará, pero el contenido en FHD y superior seguirá siendo restringido. Este problema no se puede corregir, al menos de momento.

- La ejecución del código fuente (con electron), hace que el cursor se oculte, este es el comportamiento esperado, sin embargo una vez empaquetado, el cursor ya no se oculta.

## ⚙️ Tests

- ✔️ Windows 10 x64 - win32_x64/ia32.
- ✔️ Ubuntu 19.04 x64 (VM) - linux_x64.
- ✔️ macOS 11.1 Big Sur (MacBook Air) - darwin_x64 (comprobado por [Mateo Fortea](https://github.com/mfortea)).
- ✔️ Rasbian 10 Buster (Raspberry Pi4) - linux_armv7l.

No comprobado en Windows, Linux y macOS para plataformas ARM, excepto linux para Raspberry (armv7l). 

**Licencia Creative Commons**

![CC-BY-NC-SA](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.eu.svg)