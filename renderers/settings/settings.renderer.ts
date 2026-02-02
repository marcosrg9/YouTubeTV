import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import { join } from 'path';
import main from '../../main';
import { DataModel } from '../../models/data.interface';
import { Dial } from '../../servers/DIAL';

export class Settings {

	private window: BrowserWindow;

	constructor() {
		app.whenReady().then(() => {

			this.window = new BrowserWindow({
				resizable: false,
				fullscreen: false,
				titleBarStyle: 'hidden',
				...(process.platform !== 'darwin' ? { titleBarOverlay: true }: {}),
				width: 730,
				height: 480,
				title: 'Settings',
				backgroundColor: '#181818',
				frame: true,
				webPreferences: {
					contextIsolation: false,
					nodeIntegration: true,
					sandbox: false
				}
			})

			ipcMain.on('update', (_, params:{ width: number, height: number, reload: boolean }) => {
				const { renderer } = main;
				renderer.setMaxRes(params);
			})

			globalShortcut.register('ctrl+shift+d', () => { this.window.webContents.toggleDevTools() });

			this.window.loadFile(join(__dirname, './index.html'));

			ipcMain.on('close', () => {
				this.destroy();
			})

			ipcMain.handle('settingsRequest', (event, args) => {
				return JSON.stringify(main.persistence.data.toJSON());
			})

			ipcMain.handle('languageRequest', (event, args) => {
				return JSON.stringify({sections: main.i18n.renderer.settings, utils: main.i18n.utils});
			})

			ipcMain.handle('updateSettings', (event, data) => {

				const settings: DataModel = JSON.parse(data);

				// Establece la resolución únicamente si es diferente.
				if (main.persistence.data.resolution != settings.resolution)
					main.renderer.setMaxRes(settings.resolution)

				// Almacena la configuración.
				// TODO: Aquí hay que usar un validador y filtrado de datos -> JOI para la siguiente versión.
				main.persistence.data.resolution = settings.resolution;
				main.persistence.data.keepSize.enabled = settings.keepSize.enabled;
				main.persistence.data.DIAL.enabled = settings.DIAL.enabled;
				main.persistence.data.DIAL.name = settings.DIAL.name;
				main.persistence.data.background = settings.background;
				main.persistence.data.userAgent.customUA = settings.userAgent.customUA;

				// Si DIAL está activado.
				if(settings.DIAL.enabled) {
					// Si no existe instancia DIAL, crea una con el nombre.
					if(!main.dial) main.dial = new Dial(settings.DIAL.name);
					// En caso contrario
					else {
						// Reemplaza el nombre.
						main.dial.friendlyName = settings.DIAL.name;
						// Si no se está escuchando, escucha.
						if(!main.dial.listening) main.dial.start();
					}
				// En caso contrario, si existe una instancia DIAL, detiene el servidor.
				} else if(main.dial) main.dial.stop();
				
			})
		})
	}

	public destroy() {
		this.window.destroy();
	}
}