import {NgModule} from "@angular/core";
import {AuthComponent} from "./auth.component";

import {AuthRoutingModule} from "./auth-routing.module";

import {LoginModule} from "./login/login.module";
import {RequestPasswordModule} from './request-password/request-password.module';
import {ThemeModule} from "../@theme/theme.module";

@NgModule({
  imports: [
    AuthRoutingModule,
    LoginModule,
    RequestPasswordModule,
    ThemeModule
  ],
  declarations: [
    AuthComponent,
  ]
})
export class AuthModule {
}
