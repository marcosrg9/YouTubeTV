import { app,
         BrowserWindow,
         nativeImage,
         globalShortcut,
         Menu,
         ipcMain } from 'electron';

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

    /** Cursor visibility flag. */
    private _cursor:     boolean = false;

    /** Resolution object. */
    private resolution: resolution = { widht: 3840, height: 2160 }

    /** Fullscreen flag. */
    private fullScreen: boolean = false;

    /** YouTube TV url with path/params */
    private url:        string;

    /** JavaScript injection code */
    private jsic:       string;

    constructor() {

    }

    private injectJSCode() {

    }

    
    public set cursor(value:boolean) {
        if (typeof value !== 'boolean') this._cursor = !this.cursor
        else this._cursor = value;
    }
    
}