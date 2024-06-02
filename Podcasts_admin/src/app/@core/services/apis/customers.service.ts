import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {ApiService, LocalStorageService} from "../common";
import { IUser } from './../../interfaces/customers.interface';
import {API_BASE_URL, API_ENDPOINT} from "../../config/api-endpoint.config";
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  
  constructor(private httpService: HttpClient) {}

  getAllPosts(): Observable<IUser[]> {
    return this.httpService.get<{ data: IUser[] }>(API_BASE_URL + API_ENDPOINT.customers.list).pipe(
      map(response => response.data) 
    );
  }


  
}
