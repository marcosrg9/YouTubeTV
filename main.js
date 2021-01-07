const dial = require('peer-dial');
const http = require('http');
const express = require('express');
const os = require('os');
const { app, BrowserWindow, nativeImage, globalShortcut, Menu } = require('electron');
let appDial = express();
let server = http.createServer(appDial);

Menu.setApplicationMenu(false);

function createWindow() {
    // Electron Params
    let win = new BrowserWindow({
        width: 1230,
        height: 720,
        title: 'YouTube TV',
        kiosk: false,
        backgroundColor: '#282828',
        icon: nativeImage.createFromPath(`${__dirname}/build/icons/icon.png`),
        setMenu: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    })
    win.setMenuBarVisibility(false);
    win.loadURL('http://www.youtube.com/tv?', {
        userAgent: 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754'
    });

    globalShortcut.register('ctrl+f', () => {
        if (win.kiosk == true) {
            win.kiosk = false;
        } else {
            win.kiosk = true;
        }
    })
    globalShortcut.register('ctrl+d', () => {
            win.toggleDevTools();
        })
        // DIAL Params
    let apps = {
        "YouTube": {
            name: "YouTube",
            state: "stopped",
            allowStop: true,
            pid: null,
            launch: function(a) {
                win.loadURL(`http://www.youtube.com/tv?${a}`, {
                    userAgent: 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754'
                });
            }
        }
    }
    let dialServer = new dial.Server({
        expressApp: appDial,
        port: 3000,
        prefix: '/dial',
        corsAllowOrigins: '*',
        friendlyName: `YouTube TV en ${os.hostname}`,
        delegate: {
            getApp: function(appName) {
                let app = apps[appName];
                return app;
            },
            launchApp: function(appName, launchData, callback) {
                let app = apps[appName];
                let pid = null;
                if (app) {
                    app.pid = 'run';
                    app.state = 'starting';
                    app.launch(launchData);
                    app.state = 'running';
                }
                callback(app.pid);
            },
            stopApp: function(appName, pid, callback) {
                let app = apps[appName];
                if (app && app.pid == pid) {
                    app.pid = null;
                    app.state = 'stopped';
                    callback(true);
                } else {
                    callback(false);
                }
            }
        }
    })
    win.on('ready-to-show', () => {
        win.webContents.insertCSS('html {cursor: none;}');
    })

    server.listen(3000, () => {
        dialServer.start();
    })
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (os.platform !== 'darwin') app.quit();
})