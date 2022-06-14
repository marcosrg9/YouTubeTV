/**
 * YouTube TV Desktop Client.
 * Copyright (c) 2021 Marcos Rodríguez Yélamo <marcosylrg@gmail.com>
 * 
 * MIT License
 * For more information, visit https://github.com/marcosrg9/YouTubeTV.
 */

import { Renderer } from './renderers/main/main.renderer';
import { Dial } from './servers/DIAL';

class Main {

    /** Contains DIAL server instance. */
    public dial:       Dial;
    /** Contains the main renderer instance. */
    public renderer:   Renderer;

    constructor() {
        this.renderer = new Renderer();
        this.dial = new Dial()
    }
}

/** Contains the instance of the main process. */
export default new Main();