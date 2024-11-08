import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { BreadcrumbModule } from "xng-breadcrumb";
import { NbCardModule, NbIconModule, NbActionsModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'; // Đảm bảo đã nhập module này
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    BreadcrumbModule,
    NbCardModule,
    NbIconModule,
    NbActionsModule,
    CommonModule,
    ChartsModule,
    HttpClientModule,
    FormsModule,
  
    
  ],
  declarations: [
    DashboardComponent,
  ],
  exports: [
    DashboardComponent,
  ]
})
export class DashboardModule { }
