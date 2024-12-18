import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme'; 
import { NbIconModule,NbThemeModule, NbLayoutModule, NbAlertModule  } from '@nebular/theme'; 
import { ThemeModule } from '../../@theme/theme.module';
import { BreadcrumbModule } from "xng-breadcrumb";
import { FormsModule} from '@angular/forms';
import { FormsRoutingModule, routedComponents } from './categories-routing.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { EditComponent } from './edit/edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from '../../@theme/components/paginator/paginator.module';
import { TinymceModule } from 'app/@theme/components/tinymce/tinymce.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [  
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbAlertModule,
    NbCardModule,
    FormsModule,
    ThemeModule,
    BreadcrumbModule,
    FormsRoutingModule,
    NbEvaIconsModule,
    NbIconModule,
    ReactiveFormsModule,
    PaginatorModule,
    TinymceModule,
    DragDropModule
  ],
  declarations: [
   ...routedComponents,
   EditComponent,
  ],
})
export class CategoriesModule { }
