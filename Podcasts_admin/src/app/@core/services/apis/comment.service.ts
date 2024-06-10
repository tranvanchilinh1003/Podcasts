import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { IAlertMessage } from "../../../@theme/components/alert/ngx-alerts.component";
import { ApiService, LocalStorageService } from "../common";
import { IComment } from "../../interfaces/comment.interface";
import { API_BASE_URL, API_ENDPOINT } from "../../config/api-endpoint.config";
import { UserInfoModel } from "../../model/user-info.model";
import { LOCALSTORAGE_KEY } from "../../config";
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class CommentService extends ApiService {

    constructor(
        private _http: HttpClient,
        private router: Router,
        private localStorageService: LocalStorageService,
        private authservice: AuthService
    ) {
        super(_http);
    }

    getPost(): Observable<any> {
        return this._http.get<{ data: IComment[] }>(API_BASE_URL + API_ENDPOINT.comment.comment, {
            headers: new HttpHeaders().set('x-access-token', this.authservice.getToken()) 
        });
    
    }

    getPostById(commentId: string): Observable<{ data: IComment}> {
        return this._http.get<{ data: IComment }>(API_BASE_URL + API_ENDPOINT.comment.comment + `/${commentId}`);
    }
    // createPost(postData: string): Observable<{ data: IPost[] }> {
    //     return this._http.post<{ data: IPost[] }>(API_BASE_URL + API_ENDPOINT.post.post, postData);
    //   }
    deleteComment(commentId: string): Observable<{ message: string }> {
        return this._http.delete<{ message: string }>(API_BASE_URL + API_ENDPOINT.comment.comment+`/${commentId}`);
    }
}