const { app, BrowserWindow, ipcMain, screen, dialog } = require('electron')
const url = require('url');
const path = require('path');
const serviceInstaller = require('./handlers/service-installation.handler');
const db = require('./handlers/db.handler');

let mainWindow

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
            })

            mainWindow.loadURL(
                url.format({
                    pathname: path.join(__dirname, `/dist/index.html`),
                    protocol: 'file:',
                    slashes: true
                })
            );

            mainWindow.webContents.openDevTools();

            mainWindow.on('closed', () => {
                mainWindow = null
            })
        } else {
            console.error(log);
            app.quit();
        }
    });
}

const checkInitialConfig = event => {
    console.log('checkInitialConfig called');
    db.checkInitialConfig((status, lookupPaths) => {
        event.returnValue = { status: status, lookupPaths: lookupPaths };
    })
}

const printServices = event => {
    const wincmd = require('node-windows');
    const { exec } = require('child_process');

    wincmd.list(processes => {
        console.log('Services:', processes.filter(process => process.SessionName === 'Services' && process.SessionName !== 'Console')[0]);
    }, true);

    exec('sc query "TeamViewer"', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout.replaceAll(' ', '')}`);
        console.log(`stdout: ${stdout.indexOf('RUNNING') !== -1}`);
    });

    event.returnValue = "";
}

const browseFolder = event => {
    dialog.showOpenDialog({ title: 'Select a folder', properties: ['openDirectory'] }).then(folderPath => {
        if (folderPath === undefined) {
            console.log("You didn't select a folder");
            event.returnValue = undefined;
            return;
        }
        event.returnValue = folderPath.filePaths[0];
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})

ipcMain.on('checkInitialConfig', (event, _) => {
    checkInitialConfig(event);
})

ipcMain.on('printServices', (event, arg) => {
    printServices(event);
})

ipcMain.on('browseFolder', (event, arg) => {
    browseFolder(event);
})
