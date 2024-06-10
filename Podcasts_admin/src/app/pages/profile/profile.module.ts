import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { BreadcrumbModule } from "xng-breadcrumb";
import { NbCardModule, NbIconModule, NbActionsModule ,NbLayoutModule} from '@nebular/theme';
import { FormsRoutingModule } from './profile-routing.module';
import { EditComponent } from './edit/edit.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [
        FormsRoutingModule,
        BreadcrumbModule,
        NbCardModule,
        NbIconModule,
        NbActionsModule,
        NbLayoutModule,
        ReactiveFormsModule
    ],
    declarations: [
    

    ],
    
})
export class ProfileModule { }