import { Component, Input, OnInit } from "@angular/core";
import { IpcRenderer } from "electron";
import { Cinema } from "src/app/models/cinema.interface";

@Component({
    selector: 'cinema',
    templateUrl: './cinema.component.html',
    styleUrls: ['./cinema.component.scss'],
  })
  export class CinemaComponent implements OnInit {
    @Input() cinema!: Cinema;
  
    private ipc!: IpcRenderer;
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
      console.log('Cinema initialized');
    }

    startCinema() {
        console.log('startCinema() called');
    }
}