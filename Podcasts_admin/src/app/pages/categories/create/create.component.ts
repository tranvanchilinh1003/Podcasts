import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'app/@core/services/apis/categories.service'; 
import { ICategories } from 'app/@core/interfaces/categories.interface'; 
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  categories: ICategories[] = [];
  newCategories: ICategories = { id: '', name: '', images:'', description: '' };
  newFileName: string = '';
  imgUpload: string = '';
  isUploading: boolean = false;
  file: File | null = null;
  validateForm!: FormGroup;

  constructor(
    private dialog: DialogService,
    private af: AngularFireStorage, 
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.validateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      images: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
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

  async onCreate() {
    if (this.validateForm.invalid) {
      console.log('Form invalid');
      return;
    }
    try{
      await this.UploadImg();  
      this.newCategories.name = this.validateForm.get('name')!.value;
      this.newCategories.images = this.newFileName;
      this.newCategories.description = this.validateForm.get('description')!.value;
  
      this.categoriesService.create(this.newCategories).subscribe({
        next: (categories: ICategories) => {
          this.categories.push(categories);
          this.dialog.success('Đã thêm thành công!');
          this.validateForm.reset(); 
          this.imgUpload = '';
  
        },
        error: error => {
          console.error('Error creating category', error);
        }
      });
    }
    catch (error) {
      console.error('Error uploading image', error);
    }
  
  }

}
