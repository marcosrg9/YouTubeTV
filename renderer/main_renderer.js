const os = require('os');
const { app, BrowserWindow, nativeImage, globalShortcut, Menu, ipcMain } = require('electron');
const { Settings } = require('./settings.renderer');

let renderer;

class Renderer {

    userAgent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754';
    url = 'http://www.youtube.com/tv?';
    cursor = false;
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
                        console.log('Estableciendo resolución preferida');
                    } catch (error) {
                        this.setResEmulator(3840,2160);
                    }
                }
            })
            .catch((err) => {
                console.log(err)
                this.setResEmulator(3840,2160);
            })

            ipcMain.on('network', (_, status) => {
                if (typeof status == 'boolean') {
                    console.log('Estado de primer inicio');
                    console.log(status);
                } else {
                    console.log('Cambio de estado de red!');
                    console.log(status);
                }
            })

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

    dialReload(a) {
        this.toggleFullScreen(true);
        this.loadURL(a);
    }


    /**
     * Inyecta un bloque de JavaScript para que los eventos de cambio de visibilidad no se emitan.
     * Esto permite que se cambie entre escritorios virtuales o se solape la ventana (en macOS) sin
     * detener la reproducción.
     */
    injector() {
        this.window.webContents.executeJavaScriptInIsolatedWorld()
        this.window.webContents.executeJavaScript(`
            console.warn('Inyectando parches');
            window.ipc = window.require('electron').ipcRenderer;
            window.addEventListener('online', () => {
                window.ipc.send('network', ('online'));
            })
            window.addEventListener('offline', () => {
                window.ipc.send('network', ('offline'));
            })
            document.title = 'YouTube TV';

            document.addEventListener('webkitvisibilitychange', function(event) {
                event.stopImmediatePropagation();
            }, true);

            document.addEventListener('visibilitychange', function(event) {
                event.stopImmediatePropagation();
            }, true);
        `)
    }

    toggleFullScreen(forced) {
        if (forced == undefined) {
            if (this.window.fullScreen) {
                this.window.setFullScreen(false)
            }
        } else {
            this.window.setFullScreen(forced);
        }
    }

    setMaxRes(params) {
        const { width, height, reload } = params;
        this.window.webContents.executeJavaScript(`
            localStorage.setItem('maxRes', JSON.stringify({ width: ${width}, height: ${height} }));
        `)
        if (reload) {
            this.setResEmulator(width, height);
            this.loadURL();
        }
    }

    async loadURL(a) {
        try {
            !a ? this.window.loadURL(this.url, {userAgent: this.userAgent})
            : this.window.loadURL(this.url+a, {userAgent: this.userAgent});
        } catch (error) {
            console.error(error);
        }
    }

    setResEmulator(emuWidth, emuHeight) {
        const [ width, height ] = this.window.getSize();
        this.window.webContents.enableDeviceEmulation({
            screenSize: { emuWidth, emuHeight },
            viewSize:   { emuWidth, emuHeight },
            scale: width / emuWidth,
            viewPosition: { x: 0.5, y: 0.5 }
        })
        this.window.removeAllListeners('resize');
        this.window.on('resize', () => {
            const [ width, height ] = this.window.getSize();
            this.window.webContents.enableDeviceEmulation({
                screenSize: { emuWidth, emuHeight },
                viewSize:   { emuWidth, emuHeight },
                scale: width / emuWidth,
                screenPosition: "mobile",
                viewPosition: { x: 0.5, y: 0.5 }
            })
        })
    }

}

module.exports = {
    Renderer, renderer
}