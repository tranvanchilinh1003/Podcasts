import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler,
  HttpRequest, HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { filterInterceptorRequest } from './filter-endpoint.interceptor';

import { LocalStorageService } from '../services/common';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(
    private local: LocalStorageService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!filterInterceptorRequest(request)) {
      const token = this.local.getItem('token') ;
      if (token) {
        request = request.clone({
          setHeaders: {
            'x-access-token': token as string
          }
        });
      }
    }
    
    return next.handle(request).pipe(
      catchError((error: any): Observable<any> => {
        return error;
      })
    );
  }
}
