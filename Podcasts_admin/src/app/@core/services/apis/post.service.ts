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
  [x: string]: any;


    constructor(
        private _http: HttpClient,
        private router: Router,
        private localStorageService: LocalStorageService,
        private authservice: AuthService,
        @Inject('INTERCEPTOR_FILTER') private interceptorFilter: any
    ) {
        super(_http);
    }

    getPost(current_page: number): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) ?
            new HttpHeaders().set('x-access-token', this.authservice.getToken()) : new HttpHeaders();
        return this._http.get<{ data: IPost[] }>(API_BASE_URL + API_ENDPOINT.post.post, { headers });
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

    addLike(postId: string, customerId: string): Observable<any> {
        return this._http.post(`${API_BASE_URL}${API_ENDPOINT.post.like}`, {
          post_id: postId,
          customers_id: customerId,
        });
      }
    
      // Remove like from post
      removeLike(postId: string, customerId: string): Observable<any> {
        return this._http.delete(`${API_BASE_URL}${API_ENDPOINT.post.like}`, {
          body: {
            post_id: postId,
            customers_id: customerId,
          },
        });
      }
    
      // Add notification for like (if needed)
      addNotification(postId: string, userId: string, senderId: string): Observable<any> {
        return this._http.post(`${API_BASE_URL}/api/notification`, {
          user_id: userId,
          sender_id: senderId,
          action: 'like',
          post_id: postId,
        });
      }
    
      // Delete notification for like (if needed)
      removeNotification(notificationId: string): Observable<any> {
        return this._http.delete(`${API_BASE_URL}/api/notification/${notificationId}`);
      }
      
     checkLikes(userId: string, postId: string): Observable<any> {
        return this._http.get(`${API_BASE_URL}${API_ENDPOINT.post.check_likes}`, {
          params: { userId, postId },
        });
      }
      updateView(postId: string): Observable<any> {
        const headers = this.interceptorFilter({ headers: new HttpHeaders() }) 
          ? new HttpHeaders().set('x-access-token', this.authservice.getToken()) 
          : new HttpHeaders();
        return this._http.post<any>(`${API_BASE_URL}${API_ENDPOINT.post.view}/${postId}`, {}, { headers });
      }

}