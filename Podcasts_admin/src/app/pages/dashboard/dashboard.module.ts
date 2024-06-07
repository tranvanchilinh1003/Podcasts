import { NgModule } from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {BreadcrumbModule} from "xng-breadcrumb";
import { NbCardModule ,NbIconModule, NbActionsModule} from '@nebular/theme';
@NgModule({
  imports: [
    BreadcrumbModule,
    NbCardModule,
    NbIconModule,
    NbActionsModule
  ],
  declarations: [
    DashboardComponent,

  ],
})
export class DashboardModule { }