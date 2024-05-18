import { NgModule } from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {BreadcrumbModule} from "xng-breadcrumb";
import { NbCardModule ,NbIconModule} from '@nebular/theme';
@NgModule({
  imports: [
    BreadcrumbModule,
    NbCardModule
  ],
  declarations: [
    DashboardComponent
  ],
})
export class DashboardModule { }
