import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService, LocalStorageService } from "../common";
import { IPost } from "../../interfaces/post.interface";
import { API_BASE_URL, API_ENDPOINT } from "../../config/api-endpoint.config";
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
        super(_http); // Gọi hàm constructor của ApiService và truyền _http
    }

    
    getPost(): Observable<any> {
        const headers = new HttpHeaders().set('x-access-token', this.authservice.getToken());
        return this._http.get<{ data: IPost[] }>(`${API_BASE_URL}${API_ENDPOINT.post.post}`, { headers });
    }

    getPostById(postId: string): Observable<{ data: IPost[] }> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<{ data: IPost[] }>(`${API_BASE_URL}${API_ENDPOINT.post.post}/${postId}`, {
            headers
        });
    }

    deletePost(postId: string): Observable<{ message: string }> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.delete<{ message: string }>(`${API_BASE_URL}${API_ENDPOINT.post.post}/${postId}`, {
            headers
        });
    }

    createPost(post: IPost): Observable<IPost> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.post<IPost>(`${API_BASE_URL}${API_ENDPOINT.post.post}`, post, {
            headers
        });
    }

    updatePost(post: IPost, postId: string): Observable<IPost> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.patch<IPost>(`${API_BASE_URL}${API_ENDPOINT.post.post}/${postId}`, post, {
            headers
        });
    }

    getSearch(key: string): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<IPost>(`${API_BASE_URL}${API_ENDPOINT.post.search}?messages=${key}`, {
            headers
        });
    }

    suggestKeywords(keyword: string): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<any>(`${API_BASE_URL}${API_ENDPOINT.post.suggest_keywords}?keyword=${keyword}`, {
            headers
        });
    }

    dataChart(): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<any>(`${API_BASE_URL}${API_ENDPOINT.post.data}`, {
            headers
        });
    }

    Chart(): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<any>(`${API_BASE_URL}${API_ENDPOINT.post.chart}`, {
            headers
        });
    }
}
