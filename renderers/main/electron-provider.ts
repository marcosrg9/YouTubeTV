import type * as Electron from 'electron';

let electronModule: typeof Electron;

try {
    
    const Castlabs = require('../../node_modules/electron-castlabs/')

    if(Castlabs && Castlabs.components) {
        Castlabs.components.then(() => {
            electronModule = Castlabs;
        })
    } else throw new Error();

} catch(err) {

    electronModule = require('electron');

}

export const {
    app,
    BrowserWindow,
    nativeImage,
    globalShortcut,
    Menu,
    screen,
    ipcMain
    // @ts-ignore
} = electronModule;

// @ts-ignore
export default electronModule;