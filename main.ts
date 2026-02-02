/**
 * YouTube TV Desktop Client.
 * Copyright (c) 2021 Marcos Rodríguez Yélamo <marcosylrg@gmail.com>
 * 
 * MIT License
 * For more information, visit https://github.com/marcosrg9/YouTubeTV.
 */
import { app, dialog, shell } from 'electron';
import { Renderer } from './renderers/main/main.renderer';
import { Settings } from './renderers/settings/settings.renderer';
import { Dial } from './servers/DIAL';
import { Persistence } from './data/persistence';
import { Updater } from './updateAgent';
import { I18n } from './i18n/i18n';
import { Dialog } from './utils/dialog.util';

class Main {

    /** Contains DIAL server instance. */
    public dial:       Dial;
    /** Contains the main renderer instance. */
    public renderer:   Renderer;
    /** Contiene la carga del archivo de configuración. */
    public persistence: Persistence;

    public readonly language: string = Object.seal(app.getPreferredSystemLanguages()[0]);
    public i18n: I18n;

    private _DEVMODE: boolean = !app.isPackaged;

    constructor() {

        console.clear();

        app.whenReady()
        .then(async () => {
            
            try {
                await this.loadLanguage();
                await this.loadSettings();
                await this.checkUpdates();
                const { DIAL, keepSize, resolution } = this.persistence.data;

                // Si DIAL está activo, instancia el servidor DIAL.
                if(DIAL.enabled) this.dial = new Dial(DIAL.name);
    
                // Instancia el renderizador.
                this.renderer = new Renderer({ keepSize, resolution });
                app.emit('ready');
                
            } catch(err: any) {
                console.log('Error')
                console.log(err)
            }

        })
    }

    private async loadLanguage() {

        try {
            this.i18n = new I18n(this.language);
        } catch(err) {
            if(err instanceof Error) {
                if(err.code === 'ENOENT') {
                    dialog.showErrorBox('Error de lectura de fichero de idiomas', `YouTube TV no ha podido continuar la ejecución porque no es capaz de cargar los archivos de idiomas.\nEsto suele deberse a una instalación corrupta, se sugiere reinstalar YouTube TV para corregir este error.`)
                    await Dialog.showDialog('Visitar el sitio de descargas', 'Visitar el sitio de descargas', '¿Deseas visitar el sitio de descargas de YouTube TV?', [ 'Si', 'No' ], 1)
                    .then(async v => {
                        if(v) await shell.openExternal('https://github.com/marcosrg9/YouTubeTV/releases/latest');
                        this.exitWithError();
                    })
                }
            } 
        }

    }

    private async loadSettings() {

        this.persistence = new Persistence();

        return this.persistence.load()
        .then(() => {
            return;
        })
        .catch(err => {
            
            const { title, message, detail, buttons, cancelId } = this.i18n.dialogs.load_settings_corrupt;
            dialog.showMessageBox({ type: 'error', title, message, detail, buttons, cancelId })
            .then((r) => {
                if(r.response == 0) {
                    console.log("Restableciendo configuración...");
                    this.persistence.init()
                    .then(() => this.loadSettings())
                } else {
                    this.exitWithError();
                }

            })
        })

    }

    private checkUpdates() {

        return Updater.checkUpdates()
        .then(updateAvailable => {

            if(updateAvailable) {
                const { title, message, detail, buttons, cancelId } = this.i18n.dialogs.update_available;
                return dialog.showMessageBox({ type: 'info', message, detail, buttons, title, cancelId })
                .then(userResponse => {
                    if(userResponse.response === 0)
                        return shell.openExternal('https://github.com/marcosrg9/YouTubeTV/releases/latest')
                    return Promise.resolve();
                })

    
            } else return Promise.resolve()
        })
    }

    public get DEVMODE(): boolean {
        return this._DEVMODE;
    }

    public exitWithError() {
        process.exit(1)
    }

    public cleanExit() {
        process.exit(0)
    }

}

/** Contains the instance of the main process. */
export default new Main();