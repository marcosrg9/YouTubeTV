// Modules
const { Renderer } = require('./renderer/main_renderer');
const { Dial } = require('./servers/DIAL');

// Third party packages
const express = require('express');

// Declarations
const appDial = express();
const renderer = new Renderer();
const dialPort = 2000;

appDial.listen(dialPort, () => {
    const dial = new Dial(appDial, renderer, dialPort);
    dial.server.start();
})