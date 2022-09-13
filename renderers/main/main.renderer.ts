import { readFile } from 'fs/promises';
import { platform } from 'os';
import { cwd } from 'process';
import { join } from 'path';
import { Settings } from '../settings/settings.renderer';


import { app,
         BrowserWindow,
         nativeImage,
         globalShortcut,
         Menu,
         ipcMain, 
         Size} from 'electron';

export interface resolution {

    /** Screen width */
    widht: number,
    /** Screen height */
    height: number

}

export class Renderer {

    /** userAgent allowed by YouTube TV. */
    private userAgent:  string = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754';

    /** Electron process */
    private window:     BrowserWindow;

    /** Settings window */
    private settings:   Settings | null;

    /** Cursor visibility flag. */
    private _cursor:    boolean = false;

    /** Resolution object. */
    private resolution: resolution = { widht: 3840, height: 2160 }

    /** Fullscreen flag. */
    private _fullScreen: boolean = false;

    /** YouTube TV url with path/params */
    private _url:       string = 'https://www.youtube.com/tv?';

    /** JavaScript injection code */
    private jsic:       string = '';

    constructor() {

        // Set app menu to null.
        Menu.setApplicationMenu(null);

        app
        .on('ready', () => {
            this.createWindow();

            this.window.webContents.executeJavaScript('localStorage.getItem(\'maxRes\');', true)
            .then((data: string) => {

            // If the usen has not set a resolution, set the default one.
            if (!data) this.setResEmulator(3840, 2160);
            else {
                try {
                    // Try to parse and set the resolution.
                    const { width, height } = JSON.parse(data);
                    this.setResEmulator(width, height);

                } catch (error) {
                    // If the data is not valid, set the default resolution.
                    this.setResEmulator(3840, 2160);
                }
            }
            })
            .catch(err => {
                // If the data is not valid or not available, set the default resolution.
                this.setResEmulator(3840, 2160);
            })

            this.url = '__DFT__';

            this.window.webContents.on('dom-ready', this.injectJSCode.bind(this) );

            this.setAccelerators();

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
                if (this.settings) {
                    this.settings.destroy();
                    this.settings = null;
                }
            })
        })
        .on('window-all-closed', () => {
            if (platform() === 'darwin') app.quit();
        })
    }

    /** Create a new renderer window. */
    private createWindow() {

        this.window = new BrowserWindow({
            width: 1230,
            height: 720,
            fullscreen: false,
            title: 'YouTube TV',
            backgroundColor: '#282828',
            icon: nativeImage.createFromPath(join(cwd(), 'build', 'icon.png')),
            webPreferences: {
                nodeIntegration: true,
                webSecurity: true,
                contextIsolation: false
            }
        })

        this.window.fullScreenable = true;
    }

    /** Inject a JavaScript code into the renderer process to patch events and add some features. */
    private async injectJSCode() {

        try {

            if (this.jsic === '') {
                this.jsic = await readFile(join(__dirname, 'injection.js'), { encoding: 'utf8' });
            }
            
            this.window.webContents.executeJavaScript(this.jsic);
            
        } catch (error) {
            debugger;
            // throw new Error(error as unknown as any);
        }
    }

    public setMaxRes(params: { width: number, height: number, reload: boolean }) {

        const { width, height, reload } = params;

        this.window.webContents.executeJavaScript(`
            localStorage.setItem('maxRes', JSON.stringify({ width: ${width}, height: ${height} }));
        `);

        if (reload) {
            this.setResEmulator(width, height);
            this.window.webContents.reload();
        }

    }

    /** Emulate a screen with assigned parameters */
    private setResEmulator(emuWidth: number, emuHeight: number) {

        // Delete all listeners.
        this.window.removeAllListeners('resize');

        // Performs an initial calculation.
        this.calcEmulatedDisplay(emuWidth, emuHeight);

        // Add a listener to the window to recalculate the emulator.
        this.window.on('resize', () => { this.calcEmulatedDisplay(emuWidth, emuHeight) });
    }

    private calcEmulatedDisplay(emuWidth: number, emuHeight: number) {

        // Get the current window size.
        const [ width, height ] = this.window.getSize();

        this.window.webContents.disableDeviceEmulation();
        
        this.window.webContents.enableDeviceEmulation({
            screenSize:         { width: emuWidth, height: emuHeight },
            viewSize:           { width: width / emuWidth, height: height / emuHeight },
            scale:              width / emuWidth,
            screenPosition:     'mobile',
            viewPosition:       { x: 0.5, y: 0.5 },
            deviceScaleFactor:  0
        })

    }

    /**
     * Listen keyboard shortcuts to perform some actions.
     */
    private setAccelerators() {

        globalShortcut.register('ctrl+s', () => {
            if (this.settings) {
                this.settings.destroy();
                this.settings = null;
            } else {
                this.settings = new Settings();
            }
        })

        globalShortcut.register('ctrl+f', () => { this.fullScreen = null; })

        globalShortcut.register('ctrl+d', () => { this.window.webContents.toggleDevTools(); })

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
        
    }

    /**
     * Load new user connection **and reload the renderer process**.
     * If value is '__DFT__', the default YouTube TV url will be loaded.
     * */
    public set url(value: string) {
        if (typeof value !== 'string') return;
        if (value.length < 1) return;
        if (value === '__DFT__') value = '';
        
        this.window.loadURL(this._url + value, { userAgent: this.userAgent })
        //this.injectJSCode();
    }

    set urlByDial (value: string) {
        if (typeof value !== 'string') return;
        if (value.length < 1) return;
    
        this.fullScreen = true;
        this.window.webContents.loadURL(this._url + value, { userAgent: this.userAgent })
    }

    public set fullScreen(value: boolean | null) {
        if (value === null) {
            this._fullScreen = !this._fullScreen;
            this.window.fullScreen = this._fullScreen;
        } else {
            if (typeof value !== 'boolean') return;
            this._fullScreen = value;
            this.window.fullScreen = value;
        }
    }
    
    /** Toggle cursor visibility */
    public set cursor(value: boolean | null) {
        if (typeof value !== 'boolean') this._cursor = !this.cursor
        else this._cursor = value;
    }
    
}