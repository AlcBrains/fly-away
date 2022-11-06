import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HomeRoutingModule } from './home-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HomeComponent } from './home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, TranslateModule, MatTableModule, MatPaginatorModule, BrowserAnimationsModule]
})
export class HomeModule { }
