import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
// import { JwtHelperService } from '@auth0/angular-jwt';

// import {IAlertMessage} from "../../../@theme/components/alert/ngx-alerts.component";
import {ApiService, LocalStorageService} from "../common";
import { IFavourite } from 'app/@core/interfaces/favourite';
import { IDetail } from 'app/@core/interfaces/favourite';
import {API_BASE_URL, API_ENDPOINT} from "../../config/api-endpoint.config";
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
  ) {
    super(_http);
  }
  getFavourite():Observable<{ data: IFavourite[] }> {
    return this._http.get<{ data: IFavourite[] }>(API_BASE_URL + API_ENDPOINT.favourite.list);
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
  getDetail():Observable<{ data: IDetail[] }> {
    return this._http.get<{ data: IDetail[] }>(API_BASE_URL + API_ENDPOINT.favourite.list);
  }
  deleteFavourite(id: string): Observable<any>{
    return this._http.delete(API_BASE_URL + API_ENDPOINT.favourite.list + `/${id}` );
  }
}