export namespace bsdiffNode {

	/**
	 * Calculates the differences between two files and generates a patch file in the file system.
	 * @param oldFile Old file.
	 * @param newFile File with changes.
	 * @param patchFile Output patch file.
	 * @param callback Function that is executed every time there is a change in progress (like an EventEmitter), the progress argument indicates the status, the err argument indicates if an error has occurred.
	 * @returns Promise to be fulfilled when the diff process has been completed.
	 */
	function diff(oldFile: string, newFile: string, patchFile: string, callback: (progress: number, err: string | undefined) => void): Promise<void>;
  
	/**
	 * Calculates the differences between two files and generates a patch file synchronously in the file system.
	 * @param oldFile Old file.
	 * @param newFile File with changes.
	 * @param patchFile Output patch file.
	 */
	function diffSync(oldFile: string, newFile: string, patchFile: string): undefined;
  
	/**
	 * Reconstructs the final file by calculating the differences between the old file and the patch file.
	 * @param oldFile Old file.
	 * @param newFile Output final reconstructed file.
	 * @param patchFile Patch file.
	 * @param callback Function that is executed every time a change in progress occurs (as an EventEmitter), the argument indicates the status.
	 * @returns Promise to be fulfilled when the reconstruction process has been completed.
	 */
	function patch(oldFile: string, newFile: string, patchFile: string, callback: (progress: number, err: string | undefined) => void): Promise<void>;
  
	/**
	 * Reconstructs the final file by calculating the differences between the old file and the patch file synchronously.
	 * @param oldFile Old file.
	 * @param newFile Output final reconstructed file.
	 * @param patchFile Patch file.
	 */
	function patchSync(oldFile: string, newFile: string, patchFile: string): undefined;
  
  }

  export interface Error {
	name: string,
	message: string,
	stack: string,
	errno: int,
	code: string
  }