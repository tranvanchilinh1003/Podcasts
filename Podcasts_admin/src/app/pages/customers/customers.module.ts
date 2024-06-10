import { NgModule } from '@angular/core';
import { NbCardModule ,NbIconModule} from '@nebular/theme';
import { NbRadioModule,NbAlertModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { CustomersRoutingModule, routedComponents } from './customers-routing.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { EditComponent } from './edit/edit.component';
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { environment } from '@environments/environment';
import { FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from '../../@theme/components/paginator/paginator.module';

@NgModule({
  imports: [
    FormsModule,
    NbCardModule,
    NbAlertModule,
    NbEvaIconsModule,
    NbIconModule,
    NbRadioModule,
    ThemeModule,
    CustomersRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    ReactiveFormsModule,
    PaginatorModule
  ],
  declarations: [
    ...routedComponents,
    EditComponent,
  ],
})
export class CustomersModule { }