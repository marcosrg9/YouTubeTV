const { app, BrowserWindow } = require('electron');

function createWindow() {
    let win = new BrowserWindow({
        width: 1230,
        height: 720,
        title: 'YouTube TV',
        backgroundColor: '#282828',
        icon: __dirname + '/build/icons/icon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.setMenuBarVisibility(false);
    win.loadURL('https://youtube.com/tv#', {
        userAgent: 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Large Screen Safari/534.24 GoogleTV/092754'
    });
}

app.whenReady().then(createWindow)