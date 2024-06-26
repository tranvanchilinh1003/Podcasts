import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  NbSidebarModule,
  NbMenuModule,
  NbDatepickerModule,
  NbDialogModule, NbWindowModule, NbToastrModule, NbChatModule
} from '@nebular/theme';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {CoreModule} from "./@core/core.module";
import {ThemeModule} from "./@theme/theme.module";
import { PaginatorModule } from '../app/@theme/components/paginator/paginator.module';
import { SharesModule } from './pages/shares/shares.module';
import { JWTInterceptor } from './@core/interceptors';
import { filterInterceptorRequest } from '../app/@core/interceptors/filter-endpoint.interceptor';
import { EXCEPT_API_ENDPOINT } from './@core/config';




@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PaginatorModule,
    SharesModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    },
    {
      provide: 'INTERCEPTOR_FILTER',
      useValue: filterInterceptorRequest
    },
    {
      provide: 'EXCEPT_API_ENDPOINT',
      useValue: EXCEPT_API_ENDPOINT
    }
  ],
  
  bootstrap: [AppComponent]
  
})
export class AppModule { }
