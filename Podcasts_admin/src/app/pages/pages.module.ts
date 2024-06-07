import { NgModule } from '@angular/core';
import { NbMenuModule } from "@nebular/theme";
import { ThemeModule } from '../@theme/theme.module';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PaginatorModule } from "../@theme/components/paginator/paginator.module";
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from "./profile/edit/edit.component";
import { NbCardModule, NbIconModule, NbActionsModule, NbLayoutModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { environment } from '@environments/environment';



@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    NbMenuModule,
    PaginatorModule,
    NbCardModule,
    NbIconModule,
    NbActionsModule,
    NbLayoutModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,

  ],
  declarations: [
    ProfileComponent,
    EditComponent,
    PagesComponent,



  ],
  providers: []
})
export class PagesModule { }
