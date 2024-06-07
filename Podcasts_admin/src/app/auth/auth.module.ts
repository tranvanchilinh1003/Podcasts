import {NgModule} from "@angular/core";
import {AuthComponent} from "./auth.component";

import {AuthRoutingModule} from "./auth-routing.module";

import {LoginModule} from "./login/login.module";
import {RequestPasswordModule} from './request-password/request-password.module';
import {ThemeModule} from "../@theme/theme.module";
import { NbCardModule, NbIconModule, NbActionsModule, NbLayoutModule } from '@nebular/theme';



@NgModule({
  imports: [
    AuthRoutingModule,  
    LoginModule,
    RequestPasswordModule,
    ThemeModule,
    NbCardModule,
    NbIconModule,
    NbActionsModule,
    NbLayoutModule
  ],
  declarations: [
    AuthComponent,
  ]
})
export class AuthModule {
}
