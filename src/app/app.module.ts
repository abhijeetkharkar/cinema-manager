import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SparkAngularModule } from '@sparkdesignsystem/spark-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CinemaGalleryComponent } from './components/cinema-gallery/cinema-gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    CinemaGalleryComponent
  ],
  imports: [
    SparkAngularModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
