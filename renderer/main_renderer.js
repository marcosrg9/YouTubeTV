const os = require('os');
const { app, BrowserWindow, nativeImage, globalShortcut, Menu } = require('electron');


class Renderer {

    userAgent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754';
    url = 'http://www.youtube.com/tv?';
    cursor = false;

    constructor() {
        Menu.setApplicationMenu(false);
        app.on('ready', () => {
            this.window = new BrowserWindow({
                width: 1230,
                height: 720,
                kiosk: false,
                title: 'YouTube TV',
                backgroundColor: '#282828',
                icon: nativeImage.createFromPath(`${__dirname}/build/icons/icon.png`),
                setMenu: false,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true
                }
            });
            
            this.window.setMenuBarVisibility(false);
            this.window.loadURL(this.url, {userAgent: this.userAgent});

            globalShortcut.register('ctrl+f', () => {
                if (this.window.kiosk == true) {
                    this.window.kiosk = false;
                } else {
                    this.window.kiosk = true;
                }
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
            
        })
        app.on('window-all-closed', () => {
            if (os.platform !== 'darwin') app.quit();
        })
    }

    dialReload(a) {
        console.log(a);
        this.window.loadURL(a, {userAgent});
    }
}

module.exports = {
    Renderer
}