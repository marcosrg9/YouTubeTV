import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import { join } from 'path';
import main from '../../main';

export class Settings {

	private window: BrowserWindow;

	constructor() {
		app.whenReady().then(() => {

			this.window = new BrowserWindow({
				resizable: false,
				fullscreen: false,
				width: 400,
				height: 500,
				title: 'Settings',
				backgroundColor: '#181818',
				webPreferences: {
					contextIsolation: false,
					nodeIntegration: true
				}
			})

			ipcMain.on('update', (_, params:{ width: number, height: number, reload: boolean }) => {
				const { renderer } = main;
				renderer.setMaxRes(params);
			})

			globalShortcut.register('ctrl+shift+d', () => { this.window.webContents.toggleDevTools() });

			this.window.loadFile(join(__dirname, 'index.html'));
		})
	}

	public destroy() {
		this.window.destroy();
	}
}