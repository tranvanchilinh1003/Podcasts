import { NgModule } from '@angular/core';
import { BreadcrumbModule } from "xng-breadcrumb";
import { NbCardModule, NbIconModule, NbActionsModule, NbLayoutModule } from '@nebular/theme';
import { EditComponent } from './edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { environment } from '@environments/environment';
@NgModule({
    imports: [
        NbLayoutModule,
        BreadcrumbModule,
        NbCardModule,
        NbIconModule,
        NbActionsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireStorageModule,
    ],
    declarations: [
        EditComponent,

    ],
    
})
export class EditModule { }