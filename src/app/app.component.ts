import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private ipc: IpcRenderer;

    @ViewChild('iconSet', { static: false})
    private iconSet!: ElementRef;

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
        window.fetch('https://spark-assets.netlify.app/spark-icons-v14.svg', {}).then(response => response.text()).then(svg => {
            this.iconSet.nativeElement.innerHTML += svg;
        });
    }
}
