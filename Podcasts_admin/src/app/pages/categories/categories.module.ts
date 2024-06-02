import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme'; 
import { NbIconModule } from '@nebular/theme'; 
import { ThemeModule } from '../../@theme/theme.module';
import { BreadcrumbModule } from "xng-breadcrumb";
import { FormsModule as ngFormsModule } from '@angular/forms';
import { FormsRoutingModule, routedComponents } from './categories-routing.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    BreadcrumbModule,
    FormsRoutingModule,
    NbEvaIconsModule,
    NbIconModule,
    
  ],
  declarations: [
   ...routedComponents,
   EditComponent,
  ],
})
export class CategoriesModule { }
