const { dialog } = require('electron');
const db = require('./db.handler');

module.exports.checkInitialConfig = event => {
    console.log('checkInitialConfig called');
    db.checkInitialConfig((status, lookupPaths) => {
        event.returnValue = { status: status, lookupPaths: lookupPaths };
    })
}

module.exports.printServices = event => {
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

module.exports.browseFolder = event => {
    dialog.showOpenDialog({ title: 'Select a folder', properties: ['openDirectory'] }).then(folderPath => {
        if (folderPath === undefined) {
            console.log("You didn't select a folder");
            event.returnValue = undefined;
            return;
        }
        event.returnValue = folderPath.filePaths[0];
    });
}