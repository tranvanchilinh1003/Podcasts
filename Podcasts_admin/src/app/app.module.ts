import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  NbSidebarModule,
  NbMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbToastrModule,
  NbChatModule
} from '@nebular/theme';

import { CoreModule } from "./@core/core.module";
import { ThemeModule } from "./@theme/theme.module";
import { PaginatorModule } from './@theme/components/paginator/paginator.module';
import { SharesModule } from './pages/shares/shares.module';
import { JWTInterceptor } from './@core/interceptors';
import { filterInterceptorRequest } from './@core/interceptors/filter-endpoint.interceptor';
import { EXCEPT_API_ENDPOINT } from './@core/config';
import { TinymceModule } from './@theme/components/tinymce/tinymce.module';

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
    DragDropModule,
    HttpClientModule,
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
    TinymceModule,
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
