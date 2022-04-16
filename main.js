/**
 * YouTube TV Desktop Client.
 * Copyright (c) 2020/21 Marcos Rodríguez Yélamo <marcosylrg@gmail.com>
 */

const { randomInt } = require('crypto');

const express = require('express');
const { waitForDebugger } = require('inspector');

const { Renderer } = require('./renderer/main_renderer');
const { Dial } = require('./servers/DIAL');

const server = express();

const renderer = new Renderer();
let dial;

waitForDebugger()

const listen = (port = 2000) => {
    server.listen(port, () => {
        dial = new Dial(server, renderer, port)
        dial.server.start();
    })
    .on('error',(err) => {
        if (err.code == 'EADDRINUSE') {
            listen(randomInt(1081, 65534));
        }
    })
}

listen();

class Main {

    server = express();
    renderer = new Renderer();

    dial

    constructor() {

        this.dial = new Dial(this.server, this.renderer)

    }
}

module.exports = { renderer };