#  YouTube TV

Cliente de YouTube TV sencillo para escritorio basado en [electron](https://www.electronjs.org/). Puede conectar un dispositivo compatible, como un teléfono o un equipo con Google Chrome y enviar los vídeos a la aplicación para visualizarlos.

Implementa un servidor [DIAL](https://en.wikipedia.org/wiki/Discovery_and_Launch) (basado en [SSDP](https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol)) para permitir la conexión desde dispositivos que usan este mismo protocolo (limitado a YouTube en esta aplicación).

Usa el userAgent permitido por YouTube TV:
```
Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754
```

Para lanzar la aplicación basta con usar el comando ```npm start``` o ```electron .``` en caso de que se encuentre instalado de forma global.


## 📦 Builds
El proyecto se puede descargar compilado y listo para su uso. Disponible para Linux, macOS y Windows. En arquitecturas x86, x64 y ARM.

[Todas las builds](https://github.com/marcosrg9/YouTubeTV/releases/latest)

## ⌨️ Atajos de teclado
- Pantalla completa (kiosk mode): <kbd>Ctrl</kbd>+<kbd>F</kbd>.
- Developer Tools: <kbd>Ctrl</kbd>+<kbd>D</kbd>.
- 🆕 Alternar visibilidad del cursor: <kbd>Ctrl</kbd>+<kbd>A</kbd>.


## 📺 Kiosk mode
> ⚠️ Activar el modo quiosco impedirá cambiar de ventanas.

El modo quiosco es, en resumidas cuentas, el modo a pantalla completa, pero es un modo "protegido", esto quiere decir que no se puede cambiar a otras ventanas, los gestos del ratón no funcionan, el atajo del tabulador tampoco funciona, se debe desactivar para cambiar entre ventanas.


Para alternar entre el modo ventana y quiosco se puede pulsar el atajo de teclado <kbd>Ctrl</kbd>+<kbd>F</kbd>.

También se puede forzar desde la instancia a BrowserWindow:
```Javascript
this.window = new BrowserWindow({
        width: 1230,
        height: 720,
        kiosk: false,
        title: 'YouTube TV',
```

## 🔨 Ajustes

- (🆕 1.1.1) El servidor DIAL de esta aplicación se ejecuta bajo el puerto 2000 por defecto. Es poco probable, pero en el caso de que este puerto ya se encuentre en uso, es posible cambiarlo por otro que se encuentre disponible, solo hay que cambiar el contenido de la constante `dialPort` del proceso principal (`main.js`) por otro puerto.

- (🆕 1.1.1) El nombre que el servidor DIAL está emitiendo es `YouTube TV en el equipo de` concatenado con el nombre del usuario que está ejecutando YouTube TV. Si prefiere usar otro nombre, puede hacerlo desde la clase Dial (`servers/DIAL.js`), allí hay una constante llamada `username`, modifica el contenido y YouTube TV empezará a emitir el nombre deseado.


## ⛔ Problemas conocidos
- Al minimizar la ventana, la reproducción se detiene. Se puede reanudar si hay un dispositivo enlazado pulsando el botón de reproducir desde YouTube.

- En la primera ejecución de la aplicación, desde la pantalla de inicio de sesión, no se puede lanzar el modo quiosco, tal vez haya algún eventListener por temas de accesibilidad y esté provocando conflicto.

- Parece que las restricciones de DRM impiden visualizar contenido en resolución HD y superior. Eventualmente, la opción HD se puede habilitar, pero el contenido en FHD y superior seguirá siendo restringido. Este problema no se puede corregir, al menos de momento.

- La ejecución del código fuente (con electron), hace que el cursor se oculte, este es el comportamiento esperado, sin embargo una vez empaquetado, el cursor ya no se oculta.

- Si se genera una cola y después otro usuario se conecta (echa al que ya estaba conectado), la cola se elimina. Este no es el comportamiento esperado, pero es algo inevitable, parece ser el funcionamiento normal de la plataforma YouTube TV.

## ⚙️ Tests

- ✅ Windows 10 x64 - win32_x64/ia32.
- ✅ Ubuntu 19.04 x64 (VM) - linux_x64.
- ✅ macOS 11.2.3 Big Sur (MacBook Air) - darwin_x64 (Marcos).
- ✅ macOS 11.1 Big Sur (MacBook Air) - darwin_x64 ([Mateo Fortea](https://github.com/mfortea)).
- ✅ Rasbian 10 Buster (Raspberry Pi4) - linux_armv7l.

No comprobado en Windows y macOS para plataformas ARM, excepto linux ARM para Raspberry (armv7l). 

<div align="center">

**Licencia Creative Commons**

![CC-BY-NC-SA](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.eu.svg)

</div>