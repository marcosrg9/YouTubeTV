/**
 * 
 */

import { join } from 'node:path';
import { copyFile, readFile, mkdir, writeFile } from 'node:fs/promises';
import { PathLike, readdirSync } from 'node:fs';
import { cwd } from 'node:process';

import { app } from 'electron';

import { DataModel } from '../models/data.interface';
import { Data } from '../models/data.model';
import main from '../main';

export class Persistence {

    private readonly appdatapath: string = app.getPath('sessionData');
    private readonly datapath: string = join(app.getPath('sessionData'), 'persistence.json');
    public data: Data;

    constructor() { }

    public async load(): Promise<void> {

        try {

            const data: string = await readFile(this.datapath as PathLike, { encoding: 'utf-8' });
            const parsed: DataModel = JSON.parse(data);
            this.data = new Data(parsed, this.save.bind(this));
            return;

        } catch(err: any) {

            if(err instanceof SyntaxError) {

                throw err

            } else if(err instanceof Error) {

                // El fichero de configuración no existe.
                if(err.code == 'ENOENT') {

                    try {

                        await this.init();
                        const data: string = await readFile(this.datapath, { encoding: 'utf-8'});
                        this.data = new Data(JSON.parse(data) as DataModel, this.save.bind(this));
                        return Promise.resolve();

                    } catch(err: any) {

                        throw err;

                    }

                } else throw err

            }


        }
        
    }

    private save() {

        const data: DataModel = {
            resolution: this.data.resolution,
            keepSize: this.data.keepSize,
            DIAL: this.data.DIAL,
            background: this.data.background,
            userAgent: this.data.userAgent
        }
        const tostring = JSON.stringify(data);
        try {
            JSON.parse(tostring);
        } catch(err: any) {
            throw new Error(err);
        }
        writeFile(this.datapath, tostring, { encoding: 'utf8' })
        .then(() => {})
        .catch((err) => {
            console.log('Error')
        })
    }

    public async init(): Promise<void> {

        const persistenceFile = main.DEVMODE
            ? join(process.cwd(), 'data', 'persistence.placeholder.json')
            : join(process.resourcesPath, 'data', 'persistence.placeholder.json');
            
        return copyFile(persistenceFile, this.datapath)

    }



}