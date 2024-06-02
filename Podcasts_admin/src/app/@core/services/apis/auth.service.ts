import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
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
      role: form.role,
      username: form.username.trim(),
      password: form.password,
      
    });
  }


  requirePassword(form: ILogin): Observable<any> {
    return this.post(API_BASE_URL + API_ENDPOINT.auth.login, {
      id: this.getid(),
      password: form.password,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    });
  }

  changePassword(form: ILogin): Observable<any> {
    return this.post(API_BASE_URL + API_ENDPOINT.auth.changePassword, {
      oldPassword: form.password,
      newPassword: form.newPassword,
      confirmNewPassword: form.confirmPassword,
      token: this.getToken(),
    });
  }

  forgotPassword(form: ILogin): Observable<any> {
    return this.post(API_BASE_URL + API_ENDPOINT.auth.forgotPassword, {
      id: form.id,
    });
  }

  confirmPassword(form: ILogin): Observable<any> {
    return this.post(API_BASE_URL + API_ENDPOINT.auth.confirmPassword, {
      id: this.getid(),
      newPassword: form.newPassword,
      verificationCode: form.verificationCode,
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

  logout() {
    return this.post<any>(API_BASE_URL + API_ENDPOINT.auth.logout, this.getToken());
  }

  isLoggedIn(): boolean {
    if (this.getToken()) {
      const expired = this.jwtHelperService.isTokenExpired(this.getToken());
      if (expired) {
        localStorage.clear();
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
