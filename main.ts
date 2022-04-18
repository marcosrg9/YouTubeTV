/**
 * YouTube TV Desktop Client.
 * Copyright (c) 2021 Marcos Rodríguez Yélamo <marcosylrg@gmail.com>
 * 
 * MIT License
 * For more information visit https://github.com/marcosrg9/YouTubeTV.
 */

import express, { Express } from 'express';
import { Dial } from './servers/DIAL';

class Main {

    /** Contains Express server instance. */
    server:     Express     = express();
    /** Contains DIAL server instance. */
    dial:       Dial;
    /** Contains main renderer instance. */
    renderer:   any;

    constructor() {
        this.dial = new Dial()
    }
}

/** Contains main process instance. */
export const process = new Main();