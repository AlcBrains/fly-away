import { Injectable } from '@angular/core';
import * as childProcess from 'child_process';
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as fs from 'fs';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  public get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  public getArrivals(): Observable<string> {
    return of(this.ipcRenderer.sendSync('get-arrivals'))
      .pipe(catchError((error: any) => throwError(() => new Error(error))));
  }

  public getDepartures(): Observable<string> {
    return of(this.ipcRenderer.sendSync('get-departures'))
      .pipe(catchError((error: any) => throwError(() => new Error(error))));
  }
}
