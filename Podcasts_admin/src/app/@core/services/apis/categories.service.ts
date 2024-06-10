import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import {ApiService, LocalStorageService} from "../common";
import { ICategories } from 'app/@core/interfaces/categories.interface';
import {API_BASE_URL, API_ENDPOINT} from "../../config/api-endpoint.config";
import {LOCALSTORAGE_KEY} from "../../config";
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})

export class CategoriesService extends ApiService {


  constructor(
    private _http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authservice: AuthService
) {
  super(_http);
}

  getCategories():Observable<any> {
    return this._http.get<{ data: ICategories[] }>(API_BASE_URL + API_ENDPOINT.categories.categories,{
      headers: new HttpHeaders().set('x-access-token', this.authservice.getToken()) 
    });
  
  }
  create(post: ICategories): Observable<ICategories> {
    return this._http.post<ICategories>(API_BASE_URL + API_ENDPOINT.categories.categories, post);
  }
  edit(categoryId: string): Observable<{ data: ICategories[] }> {
    return this._http.get<{ data: ICategories[] }>(API_BASE_URL + API_ENDPOINT.categories.categories + `/${categoryId}`);
  }
  getIdCate(categoryId: string): Observable<ICategories> {
    return this._http.get<ICategories>(API_BASE_URL + API_ENDPOINT.categories.categories + `/${categoryId}`);
  }

  update(categoryId: string, updatedCategory: ICategories): Observable<ICategories> {
    return this._http.patch<ICategories>(API_BASE_URL + API_ENDPOINT.categories.categories + `/${categoryId}`, updatedCategory);
  }

  delete(categoryId: string): Observable<any> {
    return this._http.delete<any>(API_BASE_URL + API_ENDPOINT.categories.categories + `/${categoryId}`);
  }

}