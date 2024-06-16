import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { IAlertMessage } from "../../../@theme/components/alert/ngx-alerts.component";
import { ApiService, LocalStorageService } from "../common";
import { IPost } from "../../interfaces/post.interface";
import { ICategories } from "../../interfaces/categories.interface";
import { API_BASE_URL, API_ENDPOINT } from "../../config/api-endpoint.config";
import { UserInfoModel } from "../../model/user-info.model";
import { LOCALSTORAGE_KEY } from "../../config";
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class PostService extends ApiService {


    constructor(
        private _http: HttpClient,
        private router: Router,
        private localStorageService: LocalStorageService,
        private authservice: AuthService
    ) {
        super(_http);
    }

    getPost(): Observable<any> {
        return this._http.get<{ data: IPost[] }>(API_BASE_URL + API_ENDPOINT.post.post, {
            headers: new HttpHeaders().set('x-access-token', this.authservice.getToken()) 
        });
    }
    getPostById(postId: string): Observable<{ data: IPost[] }> {
        return this._http.get<{ data: IPost[] }>(API_BASE_URL + API_ENDPOINT.post.post + `/${postId}`);
    }
    deletePost(postId: string): Observable<{ message: string }> {
        return this._http.delete<{ message: string }>(API_BASE_URL + API_ENDPOINT.post.post + `/${postId}`);
    }
    createPost(post): Observable<IPost> {
        return this._http.post<IPost>(API_BASE_URL + API_ENDPOINT.post.post, post);
    }
    updatePost( post: IPost ,postId: string): Observable<IPost> {
        return this._http.patch<IPost>(API_BASE_URL + API_ENDPOINT.post.post + `/${postId}`, post);
    }
    getSearch(key: string): Observable<any> { 
        return this._http.get<IPost>(API_BASE_URL + API_ENDPOINT.post.search + `?messages=${key}`);
    }
    suggestKeywords(keyword: string): Observable<any> {
        return this._http.get<any>(API_BASE_URL + API_ENDPOINT.post.suggest_keywords + `?keyword=${keyword}`);
      }
    dataChart(): Observable<any> {
        return this._http.get<any>(API_BASE_URL + API_ENDPOINT.post.data);
    }
    Chart(): Observable<any> {
        return this._http.get<any>(API_BASE_URL + API_ENDPOINT.post.chart);
    }
}