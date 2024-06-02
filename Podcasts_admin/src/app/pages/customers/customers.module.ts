import { NgModule } from '@angular/core';
import { NbCardModule ,NbIconModule} from '@nebular/theme';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { NbRadioModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { CustomersRoutingModule, routedComponents } from './customers-routing.module';
import { ListComponent } from './list/list.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { EditComponent } from './edit/edit.component';
import {HttpClientModule} from "@angular/common/http";
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { environment } from '@environments/environment';


@NgModule({
  imports: [
    NbCardModule,
    NbEvaIconsModule,
    NbIconModule,
    NbRadioModule,
    ThemeModule,
    CustomersRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  declarations: [
    ...routedComponents,
    EditComponent,
  ],
})
export class CustomersModule { }
