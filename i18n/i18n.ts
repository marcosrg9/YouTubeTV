import { readFileSync, readFile } from 'node:fs';
import { join } from 'node:path';
import main from '../main';

export interface dialog {
    title: string,
    message: string,
    detail: string,
    buttons: string[],
    cancelId: number
}

export interface dialogs {
    load_settings_corrupt: dialog,
    update_available: dialog
}

export interface utils {
    boolean_enabled_disabled: {
        true: string,
        false: string
    },
    yes_no_buttons: {
        yes: string,
        no: string
    }
}

export interface content {
    dialogs: dialogs,
    renderer: any,
    utils: utils
}

export class I18n {

    private source: string = main.DEVMODE ? join(process.cwd(), 'i18n') : join(process.resourcesPath, 'i18n');
    private content: content;

    /**
     * La clase I18n gestiona la carga de los archivos de idiomas.
     * Si el parámetro _lang no está definido, cargará 
     * @param _lang Idioma preferido.
     */
    constructor(private _lang: string = 'en-US') {

        console.log(join(this.source, _lang + '.json'));

        let data;
        try {
            data = readFileSync(join(this.source, _lang + '.json'), { encoding: 'utf-8' });
            this.content = JSON.parse(data);
        } catch(err) {
            if(err instanceof Error) {
                if(err.code === 'ENOENT' && this._lang !== 'en-US') return new I18n('en-US');
                else throw err;
            } else throw err;
        }
        /* readFile(join(this.source, _lang + '.json'), 'utf-8', (err, d) => {

            // Fallback language.
            if(err) return new I18n('en-US');
            
            let data = "";
            for(let chunk of d) data += chunk;

            this.content = JSON.parse(data);
            
        }) */

    }

    private reloadLanguage() {



    }

    get language(): string {
        return this._lang;
    }

    get dialogs(): dialogs {
        return this.content.dialogs;
    }

    get renderer(): { settings: any } {
        return this.content.renderer;
    }

    get utils(): utils {
        return this.content.utils;
    }

}