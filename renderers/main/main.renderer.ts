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
         screen,
         ipcMain, 
         session} from 'electron';
import { DataModel } from '../../models/data.interface';
import main from '../../main';

export interface resolution {

    /** Screen width */
    width: number
    /** Screen height */
    height: number

}

interface windowParams {

    bounds: Electron.Rectangle
    fullscreen: boolean
    cursor: boolean

}

type resolutionString = '8k' | '4k' | '2k' | '1080p' | '720p';

export class Renderer {

    /** userAgent allowed by YouTube TV. */
    //private readonly userAgent: string = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754';
    //private readonly userAgent: string = 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.2 Chrome/141.0.7390.108 TV Safari/537.36';
    // Este funciona...
    private userAgent: string = 'Mozilla/5.0 (PS4; Leanback Shell) Gecko/20100101 Firefox/65.0 LeanbackShell/01.00.01.75 Sony PS4/ (PS4, , no, CH)';
    //private readonly userAgent: string = 'Mozilla/5.0 (PS4; Leanback Shell) Gecko/20100101 Firefox/65.0"#/?env_forceFullAnimation/full-animation app-quality-root=true LeanbackShell/01.00.01.75 Sony PS4/ (PS4, , no, CH)';
    //private userAgent: string = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/90.0.4430.212 Large Screen Safari/534.24 GoogleTV/092754youtube.com/tv# Silk-Accelerated=true';
    //private userAgent: string = 'Mozilla/5.0 (Linux; Android 12) Cobalt/22.2.3-gold (PS4)';
    // Este parece devolver una interfaz más moderna...
    //private readonly userAgent: string = 'Mozilla/131.0.3 (Linux; Android 14; CPH2467) Cobalt/23.2.3-gold (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36"#/?env_forceFullAnimation/full-animation app-quality-root=true';
    //private readonly userAgent: string = 'Mozilla/5.0 (Linux; Android 12) Cobalt/22.2.3-gold (PS4)';
    //private userAgent: string = 'Mozilla/5.0 Cobalt/25 (Sony, PS4, Wired)';
    // Estos no alcanzan 1080
    //private userAgent: string = 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.2 Chrome/108.0.0.0 TV Safari/537.36';
    //private userAgent: string = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 WebAppManager Safari/537.36';
    //private userAgent: string = 'Mozilla/5.0 (PlayStation 5/SmartTV) AppleWebKit/605.1.15 (KHTML, like Gecko)';
    // Este no funciona...
    //private userAgent: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox Series X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63';

    /** Electron process */
    private window: BrowserWindow;

    /** Settings window */
    private settings: Settings | null;

    /** Cursor visibility flag. */
    private _cursor: boolean = false;

    /** YouTube TV url with path/params */
    private readonly _url: string = 'https://www.youtube.com/tv?';

    /** JavaScript injection code */
    private jsic: string = '';

    /** JavaScript injection title bar styles */
    private titleBar: string = '';

    constructor(private _data: Pick<DataModel, 'keepSize' | 'resolution'>) {

        app.on('ready', async() => {
            
            // Set app menu to null.
            Menu.setApplicationMenu(null);
            
            try {
                const { components } = require('electron');
                // Waits to castlabs.
                await components.whenReady();
                this.userAgent = 'Mozilla/5.0 Cobalt/25 (Sony, PS4, Wired)';
            } catch(err) {
                console.log('Castlabs not available...')
                console.log(err)
            }

            if(main.DEVMODE) this.enableAdBlock();
            
            this.createWindow();
    
            this.listenWindowEvents();
    
            this.url = '__DFT__';

            this.window.on('ready-to-show', () => {
                this.window.webContents.on('dom-ready', () => {
                    this.injectJSCode.bind(this)
                });
                this.window.webContents.on('will-navigate', () => {
                    this.injectJSCode.bind(this)
                });
    
                this.window.webContents.on('did-navigate-in-page', () => {
                    this.injectJSCode('all');
                })
            })
    
            this.setAccelerators();
    
            this.window.on('close', () => {
                if (this.settings) {
                    this.settings.destroy();
                    this.settings = null;
                }
            })
            this.window.on('moved', () => {
                const { x, y } = this.window.getBounds();
                this._data.keepSize.bounds.x = x;
                this._data.keepSize.bounds.y = y;
            })
            this.window.on('enter-full-screen', () => {
                this._data.keepSize.fullScreen = true;
            })
            this.window.on('leave-full-screen', () => {
                this._data.keepSize.fullScreen = false;
            })
        })

        .on('window-all-closed', () => { app.quit() })
    }

    /** Create a new renderer window. */
    private createWindow() {

        let data;
        
        if(this._data.keepSize.enabled) {
            data = { ...this._data.keepSize.bounds, fullscreen: this._data.keepSize.fullScreen };
            if(data.width < 1230) data.width = 1230;
            if(data.height < 720) data.height = 720;
            
            if(data.x == 0) data.x = (screen.getPrimaryDisplay().size.width / 2) - (data.width / 2);
            if(data.y == 0) data.y = (screen.getPrimaryDisplay().size.height / 2) - (data.height / 2);
        } else {
            const x = (screen.getPrimaryDisplay().size.width / 2) - 1230;
            const y = (screen.getPrimaryDisplay().size.height / 2) - 720;
            data = { x, y, height: 1230, width: 720, fullscreen: false };
        }

        this.window = new BrowserWindow({
            minWidth: 1230,
            minHeight: 720,
            ...data,
            titleBarStyle: platform() === 'darwin' ? 'hiddenInset' : 'default',
            fullscreenable: true,
            title: 'YouTube TV',
            backgroundColor: '#282828',
            icon: nativeImage.createFromPath(join(cwd(), 'build', 'icon.png')),
            webPreferences: {
                nodeIntegration: true,
                backgroundThrottling: false,
                contextIsolation: false,
                //partition: `persist`,//:${Math.random().toString()}`,
                autoplayPolicy: 'no-user-gesture-required',
                plugins: true
            }
        });

        this.window.webContents.session.webRequest.onBeforeSendHeaders(

            // Para la siguiente versión, intentar inspeccionar este tráfico.
            // Almacena todos los eventos de pulsación desde el mando de la aplicación de YouTube.
            /* https://www.youtube.com/api/lounge/bc/bind */
            { urls: ['*://*.youtube.com/*',] },
            (details, callback) => {
                
                if(details.requestHeaders['sec-ch-ua']) delete details.requestHeaders['sec-ch-ua'];
                if(details.requestHeaders['sec-ch-ua-mobile']) delete details.requestHeaders['sec-ch-ua-mobile'];
                if(details.requestHeaders['sec-ch-ua-platform']) delete details.requestHeaders['sec-ch-ua-platform'];
                if(details.requestHeaders['sec-ch-ua-full-version']) delete details.requestHeaders['sec-ch-ua-full-version'];
                
                details.requestHeaders["User-Agent"] = this.userAgent;
                callback({ cancel: false, requestHeaders: details.requestHeaders });
            }
        )

        //process.nextTick(() => this.loadSettings());
        process.nextTick(() => this.setResEmulator());

    }

    /**
     * Inject a JavaScript code into the renderer process to patch events and add some features.
     * @param script Type of script to be injected.
     * */
    private async injectJSCode(script: 'all' | 'patchs' | 'titlebar' = 'all') {

        try {
            
            if (this.jsic === '') {
                this.jsic = await readFile(join(__dirname, 'injection.js'), { encoding: 'utf8' });
            }

            if (platform() === 'darwin' && this.titleBar === '') {
                this.titleBar = await readFile(join(__dirname, 'titleBar.js'), { encoding: 'utf8' });
            }

            if (script === 'all') {
                this.window.webContents.executeJavaScript(this.jsic);
                platform() === 'darwin' ? this.window.webContents.executeJavaScript(this.titleBar) : false;
                
            } else if (script === 'patchs') {
                this.window.webContents.executeJavaScript(this.jsic);

            } else if (script === 'titlebar') {
                platform() === 'darwin' ? this.window.webContents.executeJavaScript(this.titleBar) : false;

            }
           
        } catch (error) {
            debugger;
            // throw new Error(error as unknown as any);
        }
    }

    public setMaxRes(param: resolutionString): void;
    public setMaxRes(param: { width: number, height: number, reload: boolean }): void;
    public setMaxRes(param: resolutionString | { width: number, height: number, reload: boolean }) {

        let width: number;
        let height: number;
        let reload: boolean = true;

        if(typeof param === 'string') {
            
            const res = {
                '8k':    { width: 7680, height: 4320 }, 
                '4k':    { width: 3840, height: 2160 }, 
                '2k':    { width: 2560, height: 1440 }, 
                '1080p': { width: 1920, height: 1080 }, 
                '720p':  { width: 1280, height: 720  }, 
            }
            
            if(!res[param]) {
                width = res['4k'].width;
                height = res['4k'].height;
            } else {
                width = res[param].width;
                height = res[param].height;
            }
            
        } else {
            width = param.width;
            height = param.height;
            reload = param.reload;
        }

        if (reload) {
            this.setResEmulator(width, height);
            this.window.webContents.reload();
        }

    }
    
    /** Emulate a screen with assigned parameters */
    private setResEmulator(emuWidth: number = 7680, emuHeight: number = 4320) {
    //private setResEmulator(emuWidth: number = 3840, emuHeight: number = 2160) {

        // Delete all listeners.
        this.window.removeAllListeners('resize');

        // Performs an initial calculation.
        this.calcEmulatedDisplay(emuWidth, emuHeight);

        // Add a listener to the window to recalculate the emulator.
        this.window.on('resize', () => {
            this.calcEmulatedDisplay(emuWidth, emuHeight);
        });
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

        globalShortcut.register('ctrl+f', () => { this.fullScreen = !this.window.isFullScreen(); })

        globalShortcut.register('ctrl+d', () => { this.window.webContents.toggleDevTools(); })

        globalShortcut.register('ctrl+a', () => this.cursor = null);
        
    }

    private listenWindowEvents() {
        this.window.on('moved', () => {
            const { x, y } = this.window.getBounds();
            this._data.keepSize.bounds.x = x;
            this._data.keepSize.bounds.y = y;
        })
        this.window.on('resized', () => {
            const [ width, height ] = this.window.getSize();
            this._data.keepSize.bounds.width = width;
            this._data.keepSize.bounds.height = height;
        })
        this.window.on('enter-full-screen', () => {
            this._data.keepSize.fullScreen = true;
            this.injectJSCode('all');
        })
        this.window.on('leave-full-screen', () => {
            this._data.keepSize.fullScreen = false;
            this.injectJSCode('all');
        })
        
    }

    private enableAdBlock() {
        // Comprobación para que no se cuele el adblock en producción.
        if(process.title.endsWith('Electron')) {
            try {
                const { ElectronBlocker } = require('@ghostery/adblocker-electron');
                ElectronBlocker.fromPrebuiltAdsAndTracking(fetch)
                .then((_:any) => {
                    _.enableBlockingInSession(session.defaultSession);
                })
                .catch((err:any) => {
                    console.error(err)
                })
            } catch(err) {
                
            }

        }
    }

    /**
     * Load new user connection **and reload the renderer process**.\
     * If value is '\_\_DFT\_\_', the default YouTube TV url will be loaded.
     * */
    public set url(value: string) {
        let url = value;
        if (typeof value !== 'string') return;
        if (value.length < 1) return;
        if (value === '__DFT__') url = '';

        this.window.loadURL(this._url + url, { userAgent: this.userAgent })
        .then(() => {
            this.injectJSCode();
        })
        .catch(async() => {

            ipcMain.once('restored', () => { this.url = value });

            this.injectJSCode('titlebar');
            const offline = await readFile(join(__dirname, 'offline_banner.js'), { encoding: 'utf8' });
            this.window.webContents.executeJavaScript(offline);

        })
    }

    public set urlByDial (value: string) {
        if (typeof value !== 'string') return;
        if (value.length < 1) return;
    
        this.window.fullScreen = true;

        this.window.webContents.loadURL(this._url + value, { userAgent: this.userAgent })
        .then(() => {
            this.injectJSCode();
        })
        // This should never happen...
        .catch(async() => {

            ipcMain.once('restored', () => { this.urlByDial = value });
            
            this.injectJSCode('titlebar');
            const offline = await readFile(join(__dirname, 'offline_banner.js'), { encoding: 'utf8' });
            this.window.webContents.executeJavaScript(offline);

        })
    }

    public set fullScreen(value: boolean | null) {
        if (value === null) {
            this.fullScreen = !this.window.isFullScreen();
            return;
        } else {
            if (typeof value !== 'boolean') return;
            this.window.fullScreen = value;
        }
        this._data.keepSize.fullScreen = this.window.isFullScreen();
    }
    
    /** Toggle cursor visibility */
    public set cursor(value: boolean | null) {
        if (typeof value !== 'boolean') this._cursor = !this._cursor
        else this._cursor = value;

        if (this._cursor) {
            this.window.webContents.insertCSS('html {cursor: default;}');
        } else if (!this._cursor) {
            this.window.webContents.insertCSS('html {cursor: none;}');
        } else {
            this.window.webContents.insertCSS('html {cursor: none;}');
        }
    }
    
}