import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'app/@core/services/apis/customers.service';
import { ICustomer } from 'app/@core/interfaces/customers.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { DialogService } from 'app/@core/services/common/dialog.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CreateComponent implements OnInit {
  [x: string]: any;

  file: File | null = null;
  newFileName: string = '';
  imgUpload: string = '';
  isUploading: boolean = false;
  newCustomers: ICustomer = {
    id: '',
    username: '',
    full_name: '',
    password: '',
    email: '',
    role: '',
    gender: '',
    images: '',
    isticket: 'active',
  };
  customer: ICustomer[] = [];
  validateForm!: FormGroup;

  constructor(
    
    private dialog: DialogService,
    private af: AngularFireStorage, 
    private customersService: CustomerService) {
    }

    OnFileChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length) {
        this.file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgUpload = e.target.result;
      };
      reader.readAsDataURL(this.file);

     
      this.validateForm.get('images')!.setValue(this.file.name);
      this.validateForm.get('images')!.markAsDirty();
      this.validateForm.get('images')!.markAsTouched();
      }
  }
  
  ngOnInit(): void {
    this.validateForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^[a-z0-9]+$')
      ]),
      full_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirm_password: new FormControl('', [
        Validators.required
      ]),
      role: new FormControl(''),
      gender: new FormControl(''),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('.+@.+\..+')
      ]),
      images: new FormControl('', [
        Validators.required
      ]),
    }, 
    { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;

    if (password !== confirmPassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  UploadImg(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.file) {
        console.error('No file selected');
        reject('No file selected');
        return;
      }

      const fileExtension = this.file.name.split('.').pop();
      const currentDate = new Date();
      this.newFileName = `${currentDate.toISOString().trim()}.${fileExtension}`;
      this.isUploading = true;
      this.imgUpload = `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${this.newFileName}?alt=media&token=c6dc72e8-a1b0-41bb-b1f5-84f63f7397e9`;
      const path = `upload/${this.newFileName}`;

      this.af.upload(path, this.file).then(() => {
        console.log('Upload Thành công');
        resolve();
      }).catch(error => {
        console.error('Upload failed:', error);
        reject(error);
      }).finally(() => {
        this.isUploading = false;
      });
    });
  }

  async onCreate(): Promise<void> {
    if (this.validateForm.invalid) {
      return;
    }
     
    try {
      await this.UploadImg();  
      this.newCustomers.images = this.newFileName;
    
      this.customersService.create(this.newCustomers).subscribe({
        next: (customer: ICustomer) => {
          this.customer.push(customer); 
          this.dialog.success('Đã thêm thành công!');
          this.validateForm.reset();  
          this.imgUpload = '';
        },
        error: error => {
          if (error.status === 400) {
            this.dialog.error('Tài khoản hoặc email đã tồn tại.');
          } else {
            console.error('Error creating customer', error);
          }
        }
      });
    } catch (error) {
      console.error('Error uploading image', error);
    }
  }
  

  resetForm() {
    this.newCustomers = {
      id: '',
      username: '',
      full_name: '',
      password: '',
      email: '',
      role: 'user',
      gender: '1',
      images: '',
      isticket: 'active',
    };
    this.file = null;
    this.newFileName = '';
    this.validateForm.reset(); 
  }
}
