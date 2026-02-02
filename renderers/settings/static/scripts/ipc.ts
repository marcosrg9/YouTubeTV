import { DataModel } from "../../../../models/data.interface";

class IPC {

    private readonly ipc: Electron.IpcRenderer = window.require('electron').ipcRenderer;
    private _settings: DataModel;

    constructor() { }

    public loadSettings(): Promise<DataModel> {
        return this.ipc.invoke('settingsRequest')
               .then(d => {
                d = JSON.parse(d);
                this._settings = d;
                return d;
            });
    }

    public getLanguageFiles(): Promise<any> {
        return this.ipc.invoke('languageRequest').then(d => JSON.parse(d))
    }

    public get settings(): DataModel {
        return this._settings;
    }

    public set settings(data: DataModel) {
        this._settings = data;
        this.ipc.invoke('updateSettings', JSON.stringify(this._settings))
        .then(() => {
        })
        .catch(() => {
            console.log('error')
        })
        
    }

}

export const ipc: IPC = new IPC();