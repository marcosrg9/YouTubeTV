import { UIControls } from './uicontrols2.js';
import { ipc } from './ipc.js'
import { DataModel } from '../../../../models/data.interface.js';
import { UIElement, UISelectElement } from './uielement2.js';
import { UIRenderer } from './uirenderer.js';

class Main {

    private eventController: UIControls = new UIControls();
    private uiRenderer: UIRenderer;
    private settings: DataModel;
    public i18n: any;

    constructor() {

        ipc.getLanguageFiles()
        .then(lang => {
            this.i18n = lang;
        })

        ipc.loadSettings()
        .then((data) => {
            this.settings = data;
            this.render()
        })
        .catch((err) => {
            alert('Se ha producido un error al obtener la configuración...')
            console.error(err)
        })

    }

    private render() {
        this.uiRenderer = new UIRenderer(this.settings);
        this.eventController.attachRenderer(this.uiRenderer);
    }

}

export const main: Main = new Main();