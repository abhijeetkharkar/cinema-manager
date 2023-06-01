import { Component, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';
import { InitialConfig } from '../../models/initial-config.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationDialog } from '../configuration-dialog/configuration-dialog.component';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Cinema } from 'src/app/models/cinema.interface';

@Component({
  selector: 'cinema-gallery',
  templateUrl: './cinema-gallery.component.html',
  styleUrls: ['./cinema-gallery.component.scss'],
})
export class CinemaGalleryComponent implements OnInit {
  private readonly SNACKBAR_CONFIG: MatSnackBarConfig<any> = {
    verticalPosition: 'top',
    horizontalPosition: 'center',
  };

  title = 'Cinema Gallery';
  description = '';

  isLoading = true;
  loadingMessage: string = '';

  isFirstTime = false;
  isManageLookupFoldersClicked = false;
  selectedLookupPaths: string[] = ['C:\\Users\\Abhijeet', 'C:\\Users\\Wakdya'];
  cinemas: Cinema[] = [];

  snackBarReference!: MatSnackBarRef<TextOnlySnackBar>;

  private ipc!: IpcRenderer;
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
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
    setTimeout(() => {
      const initialConfig: InitialConfig = this.ipc.sendSync(
        'check-initial-config'
      );
      /* const initialConfig: InitialConfig = {
        status: false,
        lookupPaths: undefined,
      }; */
      if (!initialConfig.status) {
        this.isFirstTime = true;
        /* this.dialog.open(ConfigurationDialog, {
          width: '250px',
          enterAnimationDuration: '50',
          exitAnimationDuration: '50',
        }); */
        /* this.snackBarReference = this.snackBar.open(
          'You have not selected a folder',
          'Dismiss',
          this.SNACKBAR_CONFIG
        );
        this.snackBarReference.afterDismissed().subscribe(() => {
          console.log('The snackbar was dismissed!');
        }); */
      } else {
        this.cinemas = this.ipc.sendSync('get-cinemas');
      }
    }, 1000);
  }

  browse() {
    console.log('browse called');
    setTimeout(() => {
      const folder = this.ipc.sendSync('browse-folder');
      if (folder) {
        this.selectedLookupPaths.push(folder);
        this.snackBar.open(
          'Lookup Path Added',
          'Dismiss',
          this.SNACKBAR_CONFIG
        );
      } else {
        this.snackBar.open(
          'Failed to add lookup path',
          'Dismiss',
          this.SNACKBAR_CONFIG
        );
      }
    }, 1000);
  }

  openSettings() {
    this.isManageLookupFoldersClicked = true;
  }

  finishAddingLookupPaths() {
    console.log('finishAddingLookupPaths called');
    setTimeout(() => {
      this.cinemas = this.ipc.sendSync('get-cinemas');
      this.isFirstTime = false;
    }, 1000);
  }

  removeFromLookupPaths(index: number) {
    this.selectedLookupPaths.splice(index, 1);
  }

  public printServices() {
    console.log('Print Services Called');
    this.ipc.sendSync('printServices');
  }
}
