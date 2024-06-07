import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { BreadcrumbModule } from "xng-breadcrumb";
import { NbCardModule, NbIconModule, NbActionsModule ,NbLayoutModule} from '@nebular/theme';
import { FormsRoutingModule } from './profile-routing.module';
import { EditComponent } from './edit/edit.component';

@NgModule({
    imports: [
        FormsRoutingModule,
        BreadcrumbModule,
        NbCardModule,
        NbIconModule,
        NbActionsModule,
        NbLayoutModule
    ],
    declarations: [
    

    ],
    
})
export class ProfileModule { }