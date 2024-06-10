import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { BreadcrumbModule } from 'xng-breadcrumb';

import { FormsRoutingModule, routedComponents } from './favourite-routing.module';
import { ListComponent } from "./list/list.component";
import { DetailComponent } from './detail/detail.component';
import { PaginatorModule } from 'app/@theme/components/paginator/paginator.module';

// import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule, 
    NbEvaIconsModule, 
    ThemeModule,
    BreadcrumbModule,
    FormsRoutingModule,
    NbTooltipModule,
    PaginatorModule
  ],
  declarations: [
    ...routedComponents,
    DetailComponent,
  
    ListComponent,
    DetailComponent
  ],
})
export class FavouriteModule { }
