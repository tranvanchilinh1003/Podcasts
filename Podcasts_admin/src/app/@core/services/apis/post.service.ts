import { Inject, Injectable } from '@angular/core';
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
        private authservice: AuthService,
        @Inject('INTERCEPTOR_FILTER') private interceptorFilter: any
    ) {
        super(_http);
    }

    getPost(page: number = 1): Observable<any> {
        let headers = new HttpHeaders();
        const token = this.authservice.getToken();
        if (token) {
          headers = headers.set('x-access-token', token);
        }
    
        const params = { page: page.toString() };
        return this._http.get<{ data: IPost[], meta: any }>(`${API_BASE_URL}${API_ENDPOINT.post.post}`, { headers, params });
      }
    getPostById(postId: string): Observable<{ data: IPost[] }> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<{ data: IPost[] }>(API_BASE_URL + API_ENDPOINT.post.post + `/${postId}`, {
            headers
        });
    }
    deletePost(postId: string): Observable<{ message: string }> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.delete<{ message: string }>(API_BASE_URL + API_ENDPOINT.post.post + `/${postId}`, {
            headers
        });
    }
    createPost(post): Observable<IPost> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.post<IPost>(API_BASE_URL + API_ENDPOINT.post.post, post, {
            headers
        });
    }
    updatePost(post: IPost, postId: string): Observable<IPost> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.patch<IPost>(API_BASE_URL + API_ENDPOINT.post.post + `/${postId}`, post, {
            headers
        });
    }
    getSearch(key: string): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<IPost>(API_BASE_URL + API_ENDPOINT.post.search + `?messages=${key}`, {
            headers
        });
    }
    suggestKeywords(keyword: string): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<any>(API_BASE_URL + API_ENDPOINT.post.suggest_keywords + `?keyword=${keyword}`, {
            headers
        });
    }
    dataChart(startDate: string, endDate: string): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() })
            ? new HttpHeaders().set('x-access-token', this.authservice.getToken())
            : new HttpHeaders();
        return this._http.get<any>(`${API_BASE_URL}${API_ENDPOINT.post.data}?startDate=${startDate}&endDate=${endDate}`, {
            headers
        });
    }
    
    Chart(): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<any>(API_BASE_URL + API_ENDPOINT.post.chart, {
            headers
        });
    }

}