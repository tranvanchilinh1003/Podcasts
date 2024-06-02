import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICustomer } from 'app/@core/interfaces/customers.interface';
import { CustomerService } from 'app/@core/services/apis/customers.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { DialogService } from 'app/@core/services/common/dialog.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  file: File | null = null;
  newFileName: string = '';
  oldImagePath: string | null = null; 
  validateForm!: FormGroup;
  editingCustomer: ICustomer = {
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

  constructor(
    private dialog: DialogService,
    private af: AngularFireStorage,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.loadEditingCustomer();
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
      role: new FormControl('', [
        Validators.required
      ]),
      gender: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('.+@.+\..+')
      ]),
      images: new FormControl(''),
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.file = input.files[0];
    }
  }

  async capNhatAnh(): Promise<void> {
    if (!this.file) {
      throw new Error('Chưa chọn file nào');
    }
  
    const fileExtension = this.file.name.split('.').pop();
    const currentDate = new Date();
    this.newFileName = `${currentDate.toISOString().trim()}.${fileExtension}`;
    const path = `upload/${this.newFileName}`;
    const fileRef = this.af.ref(path);
  
    await this.af.upload(path, this.file);
    console.log('Cập nhật thành công, new file name:', this.newFileName);
  }
  

  loadEditingCustomer(): void {
    const id = this.route.snapshot.params['id'];
    this.customerService.edit(id).subscribe({
      next: (response: { data: ICustomer[] }) => {
        this.editingCustomer = response.data[0];
        this.oldImagePath = this.editingCustomer.images;
        console.log(this.oldImagePath);
      },
      error: error => {
        console.error('Error fetching editing Customer', error);
      }
    });
  }

  async onUpdate(): Promise<void> {
   
    let formValid = true;
    for (const controlName in this.validateForm.controls) {
      if (controlName !== 'password' && controlName !== 'confirm_password') {
        const control = this.validateForm.controls[controlName];
        if (control.invalid) {
          formValid = false;
          break;
        }
      }
    }
  

    const passwordControl = this.validateForm.controls['password'];
    const confirmPasswordControl = this.validateForm.controls['confirm_password'];
    if (passwordControl.value || confirmPasswordControl.value) {
      if (passwordControl.invalid || confirmPasswordControl.invalid || passwordControl.value !== confirmPasswordControl.value) {
        formValid = false;
      }
    }
  
    if (!formValid) {
      return;
    }
  
    const id = this.route.snapshot.params['id'];
    this.editingCustomer.id = id;
  
    
    if (passwordControl.value) {
      this.editingCustomer.password = passwordControl.value;
    }
  
    try {
      if (this.file) {
        await this.capNhatAnh();
        this.editingCustomer.images = this.newFileName;
      }
      this.customerService.update(id, this.editingCustomer).subscribe({
        next: () => {
          this.dialog.success('Đã cập nhật thành công!');
        },
        error: error => {
          console.error('Error updating Customer', error);
        }
      });
    } catch (error) {
      console.error('Error during the update process', error);
    }
  }
  
  
  
}
