import { Component, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';
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
        console.log('browse called');
        setTimeout(() => {
            var folder = this.ipc.sendSync('browseFolder');
            if (folder) {
                this.selectedLookupPaths.push(folder);
                this.alertType = undefined;
                this.alertMessage = undefined;
            } else {
                this.alertType = 'fail';
                this.alertMessage = 'You have not selected a folder';
            }
        }, 1000);
    }

    openSettings() {
        this.isManageLookupFoldersClicked = true;
    }

    confirmLookupFolders(event: any) {
        console.log(`confirmLookupFolders called, event: ${event}`);
        this.isFirstTime = false;
        // this.cinemas = this.ipc.sendSync('getCinemas');
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
