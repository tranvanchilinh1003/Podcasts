import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {SpinnerService} from "../../@theme/components/spinner/spinner.service";
import {AuthService} from "../../@core/services/apis";
import {LocalStorageService} from "../../@core/services/common";
import {LOCALSTORAGE_KEY, ROUTER_CONFIG} from "../../@core/config";
import {IAlertMessage} from "../../@theme/components/alert/ngx-alerts.component";
import { finalize } from 'rxjs';
import { ILogin } from 'app/@core/interfaces/login.interface';
import { DialogService } from 'app/@core/services/common/dialog.service';
@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})
export class RequestPasswordComponent {
  requestpasswordForm: FormGroup;
  otpForm: FormGroup;
  changeForm: FormGroup;
  otp: boolean = false;
  emailcheck: boolean = true;
  changePassword: boolean = false;
  alertMessages: IAlertMessage[] = [];
  
  constructor(
    private dialog: DialogService,
    private router: Router,
    private spinner: SpinnerService,
    private auth: AuthService,
    private storageService: LocalStorageService,
    private formBuilder: FormBuilder
  ) {
  }
  buildOtpForm() {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.requestpasswordForm = new FormGroup({
      email: new FormControl('', Validators.required),
    });
    
      this.otpForm = this.formBuilder.group({
        otp: this.formBuilder.group({
          otp1: ['', [Validators.required, Validators.maxLength(1)]],
          otp2: ['', [Validators.required, Validators.maxLength(1)]],
          otp3: ['', [Validators.required, Validators.maxLength(1)]],
          otp4: ['', [Validators.required, Validators.maxLength(1)]],
          otp5: ['', [Validators.required, Validators.maxLength(1)]]
        })
      });
      this.changeForm = this.formBuilder.group({
        password: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+$/),
          Validators.minLength(8)
        ]],
        confirmpassword: ['', Validators.required]
      }, { validator: this.passwordMatchValidator });
    
  }

  onSubmit() {
    if (this.requestpasswordForm.valid) {
      this.spinner.show();
      this.auth.forgotPassword(this.requestpasswordForm.value).pipe(
        finalize(() => {
          this.spinner.hide();
        })
      ).subscribe({
        next: (response) => {
        this.handleLoginSuccess(response)
          this.otp = true;
          this.emailcheck = false
          this.dialog.success('Check email để nhập OTP')
        },
        error: (error) => {
          this.otp = false;
          this.handleEmailFailed();
        }
      });
    }
  }
  getOtpValue(): string {
    const otpGroup = this.otpForm.get('otp') as FormGroup;
    const otpValue = `${otpGroup.get('otp1').value}${otpGroup.get('otp2').value}${otpGroup.get('otp3').value}${otpGroup.get('otp4').value}${otpGroup.get('otp5').value}`;
    return otpValue;
  }

  submitOTP() {
    if (this.otpForm.valid) {
      const otp = this.getOtpValue();      
      const email = this.storageService.getItem('email');
      const otpGroup = {
        email,
        otp
      }
      this.spinner.show();
      this.auth.checkOTP(otpGroup as ILogin).pipe(
        finalize(() => {
          this.spinner.hide();
        })
      ).subscribe({
        next: (response) => {
          
          this.otp = false;
          this.changePassword = true
          this.dialog.success('Thành công');
        },
        error: (error) => {
          this.handleOTPFailed();
        }
      });
    
    } 
  }
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password').value;
    const confirmpassword = form.get('confirmpassword').value;
  
    if (password === confirmpassword) {
      return null;
    } else {
      return { 'confirm': true };
    }
  }

  changePass(): void {
    if (this.changeForm.valid) {
      const newPassword = this.changeForm.value.password;
      const email = this.storageService.getItem('email');
      this.spinner.show();
      const form = { email, password: newPassword };

      this.auth.changePassword(form as ILogin).pipe(
        finalize(() => {
          this.spinner.hide();
        })
      ).subscribe({
        next: (response) => {
        this.dialog.success('Thay đổi mật khẩu thành công');
        this.router.navigateByUrl('/auth/login');

        },
        error: (error) => {
          this.handlePasswordChangeFailed();
        }
      });
    } else {
      console.error('Form thay đổi mật khẩu không hợp lệ');
    }
  }




  protected handleLoginSuccess(res) {
    this.storageService.setItem(LOCALSTORAGE_KEY.email, res.data);
    this.spinner.hide();
  }

  protected handleEmailFailed() {
    this.spinner.hide();
    this.alertMessages = [{status: 'danger', message: 'Email không tồn tại'}];
  }
  protected handleOTPFailed() {
    this.spinner.hide();
    this.alertMessages = [{status: 'danger', message: 'OTP không trùng khớp'}];
  }
  protected handlePasswordChangeFailed() {
    this.spinner.hide();
      this.alertMessages = [{status: 'danger', message: 'Thay đổi mật khẩu không thành công'}];
    }
  
}
