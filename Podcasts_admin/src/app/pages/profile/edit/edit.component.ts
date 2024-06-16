import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from "../../../@core/services/common/local-storage.service";
import { LOCALSTORAGE_KEY } from "../../../@core/config";
import { CustomerService } from 'app/@core/services/apis/customers.service';
import { ICustomer } from 'app/@core/interfaces/customers.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { DialogService } from 'app/@core/services/common/dialog.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  inforAdmin = this.storageService.getItem(LOCALSTORAGE_KEY.userInfo);
  formEdit!: FormGroup;
  imageFile: File | null = null;
  uploadProgress = 0;
  newFileName: string = '';
  imageUrl: string | null = null;
  uploadingImage: boolean = false;
  imagePath: string | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private storageService: LocalStorageService,
    private customerService: CustomerService,
    private storage: AngularFireStorage,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.formEdit = this.formBuilder.group({
      username: [''],
      full_name: [''],
      gender: [''],
      email: [''],
      images: [''],
      password: this.inforAdmin[0].password,
      role: 'admin',
      isticket: 'active'
    });
    this.editFormValue();
  }

  editFormValue(): void {
    const id = this.inforAdmin[0].id;
    this.customerService.edit(id).subscribe({
      next: (data: { data: ICustomer[] }) => {
        const userData = data.data[0];
        this.formEdit.patchValue({
          username: userData.username,
          full_name: userData.full_name,
          gender: userData.gender == '0' ? 'Nam' : 'Nữ',
          email: userData.email
        });
      },
      error: error => {
        console.error('Error editing', error);
      }
    });
  }

  onImageChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
        this.imageFile = input.files[0];
        this.imagePath = URL.createObjectURL(input.files[0]);
    }
}


  async capNhatAnh(): Promise<void> {
    if (!this.imageFile) {
        throw new Error('Chưa chọn file nào');
    }
    this.uploadingImage = true;
    const fileName = this.imageFile.name;
    this.newFileName = fileName;
    const fileExtension = fileName.split('.').pop();
    const currentDate = new Date();
    this.newFileName = `${currentDate.toISOString().trim()}.${fileExtension}`;
    const path = `upload/${this.newFileName}`;
    const fileRef = this.storage.ref(path);

    await this.storage.upload(path, this.imageFile);
    console.log('Cập nhật thành công, new file name:', this.newFileName);
    this.uploadingImage = false;
}

  
async onSubmit(): Promise<void> {
  if (this.formEdit.invalid) {
    return;
  }

  const id = this.inforAdmin[0].id;
  if (this.formEdit.value.gender === 'Nam') {
    this.formEdit.get('gender')?.setValue(0);
  }
  if (this.formEdit.value.gender === 'Nữ') {
    this.formEdit.get('gender')?.setValue(1);
  }
  try {
    let imageData: string | null = null;

    if (this.imageFile) {
      await this.capNhatAnh();
      imageData = this.newFileName;
    } else {
      imageData = this.inforAdmin[0].images;
    }
    this.formEdit.value.images = imageData;

    this.customerService.update(id, this.formEdit.value).subscribe({
      next: (update) => {
        this.inforAdmin = update;
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
