import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerService } from "../../@theme/components/spinner/spinner.service";
import { AuthService } from "../../@core/services/apis";
import { LocalStorageService } from "../../@core/services/common";
import { LOCALSTORAGE_KEY, ROUTER_CONFIG } from "../../@core/config";
import { IAlertMessage } from "../../@theme/components/alert/ngx-alerts.component";
import { finalize } from "rxjs";
import { DialogService } from '../../@core/services/common/dialog.service'
@Component({
  selector: 'ngx-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  alertMessages: IAlertMessage[] = [];
  loading = false;
  errorMessage: string = '';
  constructor(
    private router: Router,
    private spinner: SpinnerService,
    private auth: AuthService,
    private storageService: LocalStorageService,
    private dialog: DialogService
  ) {
  }

  ngOnInit(): void {

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])

    });

  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.spinner.show();
      this.loading = true;
      this.auth.login(this.loginForm.value).pipe(
        finalize(() => {
          this.loading = false;
          this.spinner.hide();
        })
      ).subscribe({
        next: (response) => {
          if (response.data[0].role === 'admin') {
            this.handleLoginSuccess(response);
          } else {
            this.handleLoginFailed();
          }
        },
        error: (error) => {
          if (error.status === 401) {
            // Xử lý lỗi Unauthorized (401)
            this.handleLoginFailed();
          } else {
            // Xử lý các lỗi khác
            this.handleLoginFailed();
          }
        }
      });
    }
  }
  

  protected handleLoginSuccess(res) {
    this.storageService.setItem(LOCALSTORAGE_KEY.userInfo, res.data);
    this.storageService.setItem(LOCALSTORAGE_KEY.token, res.token);
    this.router.navigate([ROUTER_CONFIG.pages]).then();
    this.spinner.hide();
  }

  protected handleLoginFailed() {
    this.spinner.hide();
    this.alertMessages = [{ status: 'danger', message: 'Tài khoản hoặc mật khẩu không chính xác' }];
  }
}
