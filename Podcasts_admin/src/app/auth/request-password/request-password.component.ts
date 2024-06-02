import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SpinnerService} from "../../@theme/components/spinner/spinner.service";
import {AuthService} from "../../@core/services/apis";
import {LocalStorageService} from "../../@core/services/common";
import {LOCALSTORAGE_KEY, ROUTER_CONFIG} from "../../@core/config";
import {IAlertMessage} from "../../@theme/components/alert/ngx-alerts.component";
@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})
export class RequestPasswordComponent {
  requestpasswordForm: FormGroup;
  alertMessages: IAlertMessage[] = [];
  constructor(
    private router: Router,
    private spinner: SpinnerService,
    private auth: AuthService,
    private storageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    this.requestpasswordForm = new FormGroup({
      email: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.requestpasswordForm.valid) {
      this.router.navigate([ROUTER_CONFIG.pages]).then();
      // this.auth.login(this.loginForm.value)
      //   .pipe(
      //     finalize(() => {
      //       this.spinner.hide();
      //     }),
      //   )
      //   .subscribe({
      //     next: this.handleLoginSuccess.bind(this),
      //     error: this.handleLoginFailed.bind(this),
      //   });
    }
  }

  protected handleLoginSuccess(res) {
    this.storageService.setItem(LOCALSTORAGE_KEY.userInfo, res.name);
    this.storageService.setItem(LOCALSTORAGE_KEY.token, res.token);
    this.router.navigate([ROUTER_CONFIG.pages]).then();
    this.spinner.hide();
  }

  protected handleLoginFailed() {
    this.spinner.hide();
    this.alertMessages = [{status: 'danger', message: 'Tài khoản hoặc mật khẩu không chính xác'}];
  }
}
