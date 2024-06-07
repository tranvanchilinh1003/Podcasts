import { NgModule } from '@angular/core';
import { BreadcrumbModule } from "xng-breadcrumb";
import { NbCardModule, NbIconModule, NbActionsModule, NbLayoutModule } from '@nebular/theme';
import { EditComponent } from './edit.component';

@NgModule({
    imports: [
        NbLayoutModule,
        BreadcrumbModule,
        NbCardModule,
        NbIconModule,
        NbActionsModule
    ],
    declarations: [
        EditComponent,

    ],
    
})
export class EditModule { }