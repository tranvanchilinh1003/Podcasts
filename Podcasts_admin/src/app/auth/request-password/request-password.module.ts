import { NgModule } from "@angular/core";
import { RequestPasswordComponent } from "./request-password.component";
import {
  NbAlertModule, NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbInputModule,
  NbLayoutModule,
  NbThemeModule,
  NbIconModule
} from "@nebular/theme";
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbAuthModule } from "@nebular/auth";
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ThemeModule } from "../../@theme/theme.module";

@NgModule({
  imports: [
    NbLayoutModule,
    NbCardModule,
    NbThemeModule,
    NbInputModule,
    NbAuthModule,
    NbAlertModule,
    NgIf,
    NgForOf,
    FormsModule,
    NbCheckboxModule,
    RouterLink,
    NbButtonModule,
    ReactiveFormsModule,
    ThemeModule,
    NbEvaIconsModule,
    NbIconModule
  ],
  declarations: [
    RequestPasswordComponent
  ],
  exports: [
    RequestPasswordComponent
  ]
})
export class RequestPasswordModule {

}
