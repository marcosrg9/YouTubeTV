const { app, BrowserWindow, ipcMain } = require('electron');

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
    
            this.window.loadFile('./renderer/index.html');

        })


    }

}

module.exports = { Settings }