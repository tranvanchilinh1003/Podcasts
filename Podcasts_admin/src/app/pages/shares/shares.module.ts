import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { FormsRoutingModule, routedComponents } from './shares-routing.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { DetailService } from 'app/@core/services/apis/shares.service';


@NgModule({
  imports: [
    NbCardModule,
    NbIconModule, 
    NbEvaIconsModule, 
    ThemeModule,
    BreadcrumbModule,
    FormsRoutingModule,
    NbTooltipModule,


  ],
  declarations: [
    ...routedComponents,
    DetailComponent,
  
    ListComponent,
    DetailComponent
  ],
  providers: [
    DetailService 
  ]
})
export class SharesModule { }
