import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { FormsRoutingModule, routedComponents } from './comment-routing.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule, 
    NbEvaIconsModule, 
    ThemeModule,
    BreadcrumbModule,
    FormsRoutingModule,
    NbTooltipModule
  ],
  declarations: [
    ...routedComponents,
    DetailComponent,
  ],
})
export class CommentModule { }
