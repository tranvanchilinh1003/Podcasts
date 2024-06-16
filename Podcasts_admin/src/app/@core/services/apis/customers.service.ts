import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import {ApiService, LocalStorageService} from "../common";
import { ICustomer } from 'app/@core/interfaces/customers.interface';
import {API_BASE_URL, API_ENDPOINT} from "../../config/api-endpoint.config";
import {LOCALSTORAGE_KEY} from "../../config";
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})

export class CustomerService extends ApiService {


  constructor(
    private _http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authservice: AuthService
) {
  super(_http);
}

  getCustomer():Observable<any> {
    return this._http.get<{ data: ICustomer[] }>(API_BASE_URL + API_ENDPOINT.customers.customers, {
      headers: new HttpHeaders().set('x-access-token', this.authservice.getToken()) 
    });
  }
  create(post: ICustomer): Observable<ICustomer> {
    return this._http.post<ICustomer>(API_BASE_URL + API_ENDPOINT.customers.customers, post);
  }
  edit(customerId: string): Observable<{ data: ICustomer[] }> {
    return this._http.get<{ data: ICustomer[] }>(API_BASE_URL + API_ENDPOINT.customers.customers + `/${customerId}`);
  }

  update(customerId: string, updatedCustomer: ICustomer): Observable<ICustomer> {
    return this._http.patch<ICustomer>(API_BASE_URL + API_ENDPOINT.customers.customers + `/${customerId}`, updatedCustomer);
  }

  delete(customerId: string): Observable<any> {
    return this._http.delete<any>(API_BASE_URL + API_ENDPOINT.customers.customers + `/${customerId}`);
  }
  getSearch(key: string): Observable<any> { 
    return this._http.get<ICustomer>(API_BASE_URL + API_ENDPOINT.customers.search + `?messages=${key}`);
}
suggestKeywords(keyword: string): Observable<any> {
    return this._http.get<any>(API_BASE_URL + API_ENDPOINT.customers.suggest_keywords + `?keyword=${keyword}`);
  }

  dataChart(): Observable<any> {
    return this._http.get<any>(API_BASE_URL + API_ENDPOINT.customers.data);
}
  override getToken() {
    return this.localStorageService.getItem<any>(LOCALSTORAGE_KEY.token);
  }
}
