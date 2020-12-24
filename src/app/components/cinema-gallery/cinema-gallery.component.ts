import { Component, OnInit } from '@angular/core';
import { IpcRenderer, remote } from 'electron';
import { InitialConfig, Cinema } from '../../models/models';

@Component({
    selector: 'cinema-gallery',
    templateUrl: './cinema-gallery.component.html',
    styleUrls: ['./cinema-gallery.component.scss']
})
export class CinemaGalleryComponent implements OnInit {
    title = 'Cinema Gallery';
    description = '';

    isLoading = true;
    loadingMessage: string = '';

    alertType: ('success' | 'fail' | 'info') = undefined;
    alertMessage: string = undefined;

    isFirstTime = false;
    isManageLookupFoldersClicked = false;
    selectedLookupPaths: string[] = [];
    cinemas: Cinema[] = [];

    private ipc: IpcRenderer;
    constructor() {
        if ((<any>window).require) {
            try {
                this.ipc = (<any>window).require('electron').ipcRenderer;
            } catch (e) {
                throw e;
            }
        } else {
            console.warn('App not running inside Electron!');
        }
    }

    ngOnInit(): void {
        console.log('Cinema Gallery initialized');
        this.loadingMessage = 'Loading Application';
        setTimeout(() => {
            var initialConfig: InitialConfig = this.ipc.sendSync('checkInitialConfig');
            var initialConfig: InitialConfig = { status: false, lookupPaths: undefined }
            this.isLoading = false;
            if (!initialConfig.status) {
                this.isFirstTime = true;
            } else {
                // this.cinemas = this.ipc.sendSync('getCinemas');
            }
        }, 1000);
    }

    browse() {
        /* if ((<any>window).require) {
            try {
                remote.dialog.showOpenDialog({ title: 'Select a folder', properties: ['openDirectory'] }).then(folderPath => {
                    if (folderPath === undefined) {
                        console.log("You didn't select a folder");
                        return;
                    }
                    this.selectedLookupPaths.push(folderPath.filePaths[0]);
                });
            } catch (e) {
                throw e;
            }
        } else {
            console.warn('App not running inside Electron!');
        } */
    }

    openSettings() {
        this.isManageLookupFoldersClicked = true;
    }

    confirmLookupFolders(event: any) {
        console.log(`confirmLookupFolders called, event: ${event}`);
        this.isFirstTime = false;
        this.cinemas = this.ipc.sendSync('getCinemas');
    }

    cancelLookupFoldersModal(event: any) {
        console.log(`cancelLookupFoldersModal called, event: ${event}`);
        this.isFirstTime = true;
    }

    hideLookupFoldersModal() {
        console.log(`hideLookupFoldersModal called, event: ${event}`);
        this.isFirstTime = true;
    }

    dismissAlert() {
        this.alertMessage = undefined;
        this.alertType = undefined;
    }

    public printServices() {
        console.log("Print Services Called");
        this.ipc.sendSync("printServices");
    }
}
