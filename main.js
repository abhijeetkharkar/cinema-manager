const { app, BrowserWindow, ipcMain, screen } = require('electron');
const url = require('url');
const path = require('path');
const serviceInstaller = require('./handlers/service-installation.handler');
const { browseFolder, checkInitialConfig, printServices } = require('./handlers/main-handler');

let mainWindow;

const createWindow = async () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    serviceInstaller.installService((status, log) => {
        if (status) {
            mainWindow = new BrowserWindow({
                width: width,
                height: height,
                webPreferences: {
                    nodeIntegration: true
                },
                icon: './cinema-manager.ico'
            });

            mainWindow.loadURL(url.format({
                    pathname: path.join(__dirname, `/dist/index.html`),
                    protocol: 'file:',
                    slashes: true
                })
            );

            mainWindow.webContents.openDevTools();

            mainWindow.on('closed', () => {
                mainWindow = null;
            })
        } else {
            console.error(log);
            app.quit();
        }
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('checkInitialConfig', (event, _) => {
    checkInitialConfig(event);
});

ipcMain.on('printServices', (event, _) => {
    printServices(event);
});

ipcMain.on('browseFolder', (event, _) => {
    browseFolder(event);
});
