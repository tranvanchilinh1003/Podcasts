import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICustomer } from 'app/@core/interfaces/customers.interface';
import { CustomerService } from 'app/@core/services/apis/customers.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
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
  newFileName: string = '';
  file: File | null = null;
  imgUpload: string = '';
  oldImagePath: string | null = null;
  oldPassword: string = '';
  validateForm!: FormGroup;
  showImagePreview: boolean = true;
  isUploading: boolean = false;

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
        Validators.minLength(8)
      ]),
      confirm_password: new FormControl(''),
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

    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  onFileChange(event: Event): void {
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

  async capNhatAnh(): Promise<void> {
    if (!this.file) {
      throw new Error('Chưa chọn file nào');
    }

    const fileExtension = this.file.name.split('.').pop();
    const currentDate = new Date();
    this.newFileName = `${currentDate.toISOString().trim()}.${fileExtension}`;
    this.isUploading = true;
    this.imgUpload = `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${this.newFileName}?alt=media&token=c6dc72e8-a1b0-41bb-b1f5-84f63f7397e9`;
    const path = `upload/${this.newFileName}`;
    const fileRef = this.af.ref(path);

    const task = this.af.upload(path, this.file);

    await task.snapshotChanges().pipe(
      finalize(() => {
        this.isUploading = false;
        this.showImagePreview = false;
      })
    ).toPromise();

    console.log('Cập nhật thành công, new file name:', this.newFileName);
  }

  loadEditingCustomer(): void {
    const id = this.route.snapshot.params['id'];
    this.customerService.edit(id).subscribe({
      next: (response: { data: ICustomer[] }) => {
        this.editingCustomer = response.data[0];
        if (this.editingCustomer.gender !== null && this.editingCustomer.gender !== undefined) {
          this.editingCustomer.gender = this.editingCustomer.gender.toString();
        }

        this.oldImagePath = this.editingCustomer.images;
        this.imgUpload = `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${this.editingCustomer.images}?alt=media&token=c6dc72e8-a1b0-41bb-b1f5-84f63f7397e9`;
        this.oldPassword = this.editingCustomer.password;

        this.validateForm.patchValue({
          username: this.editingCustomer.username,
          full_name: this.editingCustomer.full_name,
          role: this.editingCustomer.role,
          gender: this.editingCustomer.gender,
          email: this.editingCustomer.email,
        });
      },
      error: error => {
        console.error('Error fetching editing Customer', error);
      }
    });
  }

  async onUpdate(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    if (this.validateForm.invalid) {
      return;
    }

    this.isUploading = true;

    try {
      if (this.file) {
        await this.capNhatAnh();
        this.editingCustomer.images = this.newFileName;
      } else {
        this.editingCustomer.images = this.oldImagePath;
      }

      const passwordControl = this.validateForm.controls['password'];
      if (passwordControl.value) {
        this.editingCustomer.password = passwordControl.value;
      } else {
        this.editingCustomer.password = this.oldPassword || '';
      }

      this.customerService.update(id, this.editingCustomer).subscribe({
        next: () => {
          this.dialog.success('Đã cập nhật thành công!');
          this.loadEditingCustomer();
          this.file = null;
        },
        error: error => {
          console.error('Error updating Customer', error);
        },
        complete: () => {
          this.isUploading = false;
          this.showImagePreview = true; 
        }
      });
    } catch (error) {
      console.error('Error during the update process', error);
      this.isUploading = false;
    }
  }

}
