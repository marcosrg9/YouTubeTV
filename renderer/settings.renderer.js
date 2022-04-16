const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');

class Settings {

    constructor() {

        app.whenReady().then(() => {

            this.window = new BrowserWindow({
                resizable: false,
                width: 400,
                height: 500,
                title: 'Configuración',
                backgroundColor: '#181818',
                webPreferences: {
                    contextIsolation: false,
                    nodeIntegration: true,
                }
            })
    
            ipcMain.on('update', (_, params) => {
                const { renderer } = require('../main')
                renderer.setMaxRes(params);
            })

            globalShortcut.register('ctrl+shift+d', () => { this.window.webContents.toggleDevTools() });
    
            this.window.loadFile('./renderer/index.html');

        })


    }

}

module.exports = { Settings }