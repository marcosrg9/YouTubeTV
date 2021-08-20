const { randomInt } = require('crypto');

const express = require('express')

const { Renderer } = require('./renderer/main_renderer');
const { Dial } = require('./servers/DIAL');

const server = express();

const renderer = new Renderer();
let dial;


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

module.exports = { renderer };