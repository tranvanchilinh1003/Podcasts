import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import {IAlertMessage} from "../../../@theme/components/alert/ngx-alerts.component";
import {ApiService, LocalStorageService} from "../common";
import {ILogin} from "../../interfaces/login.interface";
import {API_BASE_URL, API_ENDPOINT} from "../../config/api-endpoint.config";
import {UserInfoModel} from "../../model/user-info.model";
import {LOCALSTORAGE_KEY} from "../../config";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {

  private loginInfo: ILogin;
  private alertMessages: IAlertMessage;
  private jwtHelperService = new JwtHelperService();

  constructor(
      private _http: HttpClient,
      private router: Router,
      private localStorageService: LocalStorageService,
  ) {
    super(_http);
  }

  login(form: ILogin): Observable<any>  {
    return this.post<any>(API_BASE_URL + API_ENDPOINT.auth.login, {
      username: form.username.trim(),
      role: form.role,
      password: form.password,
      // role: form.role,
    });
  }


  requirePassword(form: ILogin): Observable<any> {
    return this.post(API_BASE_URL + API_ENDPOINT.auth.requirePassword, {
      id: this.getid(),
      password: form.password,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    });
  }

  changePassword(form: ILogin): Observable<any> {
    return this.patch(API_BASE_URL + API_ENDPOINT.auth.changePassword, {
    password: form.password,
    email: form.email,
    });
  }

  forgotPassword(form: ILogin): Observable<any> {
    return this.post(API_BASE_URL + API_ENDPOINT.auth.forgotPassword, {
      id: form.id,
      email: form.email
    });
  }
  checkOTP(form: ILogin): Observable<any> {
    return this.post(API_BASE_URL + API_ENDPOINT.auth.otp, {
      email: form.email,
      otp: form.otp
    });
  }


  updateProfile(form: UserInfoModel): Observable<any> {
    return this.patch(API_BASE_URL + API_ENDPOINT.auth.updateProfile, {
      firstName: form.firstName,
      lastName: form.lastName,
      token: this.getToken(),
    });
  }

  getid() {
    if (this.loginInfo) {
      return this.loginInfo.id;
    }
    return null;
  }

  cacheLoginInfo(value: ILogin) {
    return this.loginInfo = value;
  }

  cacheUpdateMessage(alertMessages: any) {
    return this.alertMessages = alertMessages;
  }

  clearMessage() {
    return this.alertMessages = null;
  }

  getUpdateMessage() {
    if (this.alertMessages) {
      return this.alertMessages;
    }
    return null;
  }

  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.post<any>(API_BASE_URL + API_ENDPOINT.auth.logout, null, { headers }).pipe(
      tap(
        () => {
          this.localStorageService.removeItem(LOCALSTORAGE_KEY.token);
          this.localStorageService.removeItem(LOCALSTORAGE_KEY.userInfo);
          this.router.navigate(['/auth/login']);
        },
        error => {
          console.error('Đăng xuất thất bại:', error);
          this.localStorageService.removeItem(LOCALSTORAGE_KEY.token);
          this.localStorageService.removeItem(LOCALSTORAGE_KEY.userInfo);
          this.router.navigate(['/auth/login']);
        }
      )
    );
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const expired = this.jwtHelperService.isTokenExpired(token);
      if (expired) {
        this.localStorageService.clear();
        return false;
      }
      return !expired;
    }
    return false;
  }


  override getToken() {
    return this.localStorageService.getItem<any>(LOCALSTORAGE_KEY.token);
  }
}
