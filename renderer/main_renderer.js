const os = require('os');
const { readFile } = require('fs/promises');
const { app, BrowserWindow, nativeImage, globalShortcut, Menu } = require('electron');
const { Settings } = require('./settings.renderer');

let renderer;

class Renderer {

    userAgent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754';
    url = 'http://www.youtube.com/tv?';
    cursor = true;
    res = { width: 3840, height: 2160 };

    constructor() {
        renderer = this;
        Menu.setApplicationMenu(false);
        app.on('ready', () => {
            this.window = new BrowserWindow({
                width: 1230,
                height: 720,
                fullScreen: true,
                title: 'YouTube TV',
                backgroundColor: '#282828',
                icon: nativeImage.createFromPath(`${__dirname}/build/icons/icon.png`),
                setMenu: false,
                webPreferences: {
                    nodeIntegration: true,
                    webSecurity: true,
                    contextIsolation: false
                }
            });

            this.window.webContents.executeJavaScript(`localStorage.getItem('maxRes');`, true)
            .then((a) => {
                console.log(a);
                if (!a) {
                    this.setResEmulator(3840,2160);
                } else {
                    try {
                        const { width, height } = JSON.parse(a);
                        this.setResEmulator(width, height);
                    } catch (error) {
                        this.setResEmulator(3840,2160);
                    }
                }
            })
            .catch((err) => {
                this.setResEmulator(3840,2160);
            })

            //ipcMain.on('network', (_, status) => { })

            this.loadURL();
            
            this.window.webContents.on('dom-ready', () => this.injector());
            
            globalShortcut.register('ctrl+s', () => {
                if (this.settings) {
                    this.settings.window.destroy();
                    this.settings = null;
                } else {
                    this.settings = new Settings();
                }
            })

            globalShortcut.register('ctrl+f', () => {
                this.toggleFullScreen();
            })
            globalShortcut.register('ctrl+d', () => {
                this.window.toggleDevTools();
            })
            globalShortcut.register('ctrl+a', () => {
                if (this.cursor) {
                    this.window.webContents.insertCSS('html {cursor: none;}')
                    this.cursor = false;
                } else if (!this.cursor) {
                    this.window.webContents.insertCSS('html {cursor: default;}');
                    this.cursor = true;
                } else {
                    this.window.webContents.insertCSS('html {cursor: none;}')
                }
            })
            
            this.window.on('ready-to-show', () => {
                if (this.cursor) {
                    this.window.webContents.insertCSS('html {cursor: default;}');
                } else if (!this.cursor) {
                    this.window.webContents.insertCSS('html {cursor: none;}');
                } else {
                    this.window.webContents.insertCSS('html {cursor: none;}');
                }
            })

            this.window.on('close', () => {
                console.log(this.settings);
                if (this.settings) {
                    this.settings.window.destroy();
                    this.settings = null;
                }
            })
            
        })
        app.on('window-all-closed', () => {
            if (os.platform !== 'darwin') app.quit();
        })
    }

    /**
     * Se encarga de controlar el enlace con YouTube TV mediante DIAL.
     * 
     * @param {string} link Enlace (link) de enlace con el dispositivo remoto.
     */
    dialReload(link) {
        this.toggleFullScreen(true);
        this.loadURL(link);
    }

    /**
     * Inyecta un bloque de JavaScript para que los eventos de cambio de visibilidad no se emitan.
     * Esto permite que se cambie entre escritorios virtuales o se solape la ventana (en macOS) sin
     * detener la reproducción.
     */
    injector() {
        this.window.webContents.executeJavaScriptInIsolatedWorld();
        readFile(`${__dirname}/main/injection.js`, { encoding: 'utf-8' })
        .then(a => {
            this.window.webContents.executeJavaScript(a);
        })
        .catch(err => {
            debugger;
        })
    }

    /**
     * Conmuta entre estados de pantalla completa.
     * @param {boolean} forced Fuerza un estado concreto.
     */
    toggleFullScreen(forced) {

        // Intercambia en caso de que forced no sea de tipo booleano (puede ser undefined).
        if (typeof forced !== 'boolean') this.window.setFullScreen(!this.window.fullScreen);
        else this.window.setFullScreen(forced);
        
    }

    /**
     * Define una resolución máxima emulada.
     * 
     * @param {{ width: number, height: number, reload: boolean }} params Parámetros de dimension y recarga.
     */
    setMaxRes(params) {

        // Desestructura el objeto de parámetros.
        const { width, height, reload } = params;

        // Ejecuta una línea en el renderizador principal para almacenar los parámetros.
        this.window.webContents.executeJavaScript(`
            localStorage.setItem('maxRes', JSON.stringify({ width: ${width}, height: ${height} }));
        `);
        
        // Recarga si el indicador de recarga es true para aplicar cambios.
        if (reload) {
            this.setResEmulator(width, height);
            this.loadURL();
        }
    }

    /**
     * Carga YouTube TV con o sin parámetros.
     * 
     * @param {string} url Enlace al sitio.
     */
    async loadURL(url) {
        try {
            // Si no existe el parámetro url, se carga la base
            !url ? this.window.loadURL(this.url, { userAgent: this.userAgent })
                 : this.window.loadURL(this.url+url, { userAgent: this.userAgent });
        } catch (error) {
            debugger;
            console.error(error);
        }
    }

    /**
     * Emula una pantalla con los parámetros asignados.
     * 
     * @param {number} emuWidth Ancho de la pantalla emulada.
     * @param {number} emuHeight Alto de la pantalla emulada.
     */
    setResEmulator(emuWidth, emuHeight) {

        // Elimina el listener anterior (si existe)
        this.window.removeAllListeners('resize');

        // Cálculo inicial.
        this.calcEmulatedDisplay(emuWidth, emuHeight);

        // Escucha el evento de redimensionado de ventana y lanza el cálculo.
        this.window.on('resize', () => { this.calcEmulatedDisplay(emuWidth, emuHeight) });
    }

    /**
     * Se encarga exclusivamente de calcular los parámetros de la pantalla emulada.
     * 
     * @param {number} emuWidth 
     * @param {number} emuHeight 
     */
    calcEmulatedDisplay(emuWidth, emuHeight) {

        // Obtiene el ancho de la pantalla.
        const [ width ] = this.window.getSize();

        // Realiza los cálculos y los asigna al emulador.
        this.window.webContents.enableDeviceEmulation({
            screenSize: { emuWidth, emuHeight },
            viewSize:   { emuWidth, emuHeight },
            scale: width / emuWidth,
            screenPosition: 'mobile',
            viewPosition: { x: 0.5, y: 0.5 }
        })

    }

}

module.exports = {
    Renderer, renderer
}