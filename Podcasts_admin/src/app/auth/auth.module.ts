import {NgModule} from "@angular/core";
import {AuthRoutingModule} from "./auth-routing.module";
import {LoginModule} from "./login/login.module";
import {AuthComponent} from "./auth.component";
import {ThemeModule} from "../@theme/theme.module";
import { NbCardModule, NbIconModule, NbActionsModule, NbLayoutModule } from '@nebular/theme';



@NgModule({
  imports: [
    AuthRoutingModule,  
    LoginModule,
    ThemeModule,
    NbCardModule,
    NbIconModule,
    NbActionsModule,
    NbLayoutModule
  ],
  declarations: [
    AuthComponent
  ]
})
export class AuthModule {
}
