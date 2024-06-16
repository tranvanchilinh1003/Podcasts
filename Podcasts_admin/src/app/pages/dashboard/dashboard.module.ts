import { NgModule } from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {BreadcrumbModule} from "xng-breadcrumb";
import { NbCardModule ,NbIconModule, NbActionsModule} from '@nebular/theme';

import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts'; 
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BreadcrumbModule,
    NbCardModule,
    NbIconModule,
    NbActionsModule,
    CommonModule,
    ChartsModule,
    HttpClientModule
  ],
  declarations: [
    DashboardComponent,

  ],
})
export class DashboardModule { }