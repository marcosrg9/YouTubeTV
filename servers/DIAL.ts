/**
 * DIAL protocol specification: http://www.dial-multiscreen.org/dial-protocol-specification
 */

import { process } from '../main';
import { Server, App, AppInfo } from 'peer-dial';

export class Dial {

    /**
     * Instancia un nuevo servidor DIAL.
     */
    constructor() {

        const app: App{} = {
            "YouTube": {
                name: 'YouTube',
                state: 'stopped',
                allowStop: true,
                pid: null,
                launch: (a: string) => {  }
            }
        }
    }
}