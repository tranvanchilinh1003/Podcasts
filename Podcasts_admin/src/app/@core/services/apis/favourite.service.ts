import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
// import { JwtHelperService } from '@auth0/angular-jwt';

// import {IAlertMessage} from "../../../@theme/components/alert/ngx-alerts.component";
import {ApiService, LocalStorageService} from "../common";
import { IFavourite } from 'app/@core/interfaces/favourite';
import { IDetail } from 'app/@core/interfaces/favourite';
import {API_BASE_URL, API_ENDPOINT} from "../../config/api-endpoint.config";
import { AuthService } from './auth.service';
// import {UserInfoModel} from "../../model/user-info.model";
// import {LOCALSTORAGE_KEY} from "../../config";

@Injectable({
  providedIn: 'root',
})
export class FavouriteService extends ApiService {

  

  constructor(
      private _http: HttpClient,
      private router: Router,
      private localStorageService: LocalStorageService,
      private authservice: AuthService
  ) {
    super(_http);
  }

  getFavourite():Observable<any> {
    return this._http.get<{ data: IFavourite[] }>(API_BASE_URL + API_ENDPOINT.favourite.favourite, {
      headers: new HttpHeaders().set('x-access-token', this.authservice.getToken()) 
    });
  }
  
}
@Injectable({
  providedIn: 'root',
})
export class DetailService extends ApiService {

  constructor(
      private _http: HttpClient,
      private router: Router,
      private localStorageService: LocalStorageService,
    
  ) {
    super(_http);
  }
  
  
  getDetail(id: string):Observable<{ data: IDetail[] }> {
    return this._http.get<{ data: IDetail[] }>(API_BASE_URL + API_ENDPOINT.favourite.favourite + `/${id}`, {
    
    });
  }
  deleteFavourite(id: string): Observable<any>{
    return this._http.delete(API_BASE_URL + API_ENDPOINT.favourite.favourite + `/${id}` );
  }
}