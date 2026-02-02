import { readFile } from 'node:fs/promises';
import { join } from 'path/posix';
import { join as joinwin } from 'path/win32'
import { version as currentVersion } from './package.json'
//import {} from 'bsdiff-node';




interface packagejson {
	version: string
	productName: string
}

export abstract class Updater {

	public static checkUpdates(): Promise<boolean> {

		
		return new Promise<boolean>((resolve, reject) => {

			fetch("https://raw.githubusercontent.com/marcosrg9/YouTubeTV/main/package.json")
			.then(r => r.json())
			.then((data: packagejson) => {
				resolve(this.compare(data.version));
				console.log(`Última versión de YouTube TV: ${data.version}`)
			})
			.catch(err => {
	
			})

		})

	}

	private static compare(version: string) {
		const current = parseInt(currentVersion.replace('.', ''));
		const newVersion = parseInt(version.replace('.', ''));

		return newVersion > current;
	}

	/**
	 * Reconstruye el binario actualizado a través de un fichero de actualización delta.
	 * @param binary Binario de actualización diferencial.
	 */
	//private rebuildDeltas(binary: Buffer): Buffer { }
}