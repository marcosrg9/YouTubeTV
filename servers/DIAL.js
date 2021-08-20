const os = require('os');
const dial = require('peer-dial');

const username = 'YouTube TV en el equipo de ' +
    os.userInfo().username
    .charAt(0)
    .toLocaleUpperCase() + os.userInfo().username
    .slice(1);
    
class Dial {

    server //= new dial.Server();

    constructor(server, renderer, port) {
        const apps = {
            "YouTube": {
                name: "YouTube",
                state: "stopped",
                allowStop: true,
                pid: null,
                launch: (a) => {
                    renderer.dialReload(a);
                }
            }
        };
        this.server = new dial.Server({
            expressApp: server,
            port,
            prefix: '/dial',
            corsAllowOrigins: '*',
            friendlyName: username,
            delegate: {
                getApp: function(appName) {
                    let app = apps[appName];
                    return app;
                },
                launchApp: function(appName, launchData, callback) {
                    const app = apps[appName];
                    if (app) {
                        app.pid = 'run';
                        app.state = 'starting';
                        app.launch(launchData);
                        app.state = 'running';
                    }
                    callback(app.pid);
                },
                stopApp: function(appName, pid, callback) {
                    renderer.toggleFullScreen(false);
                    const app = apps[appName];
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
    }

}

module.exports = {
    Dial
}