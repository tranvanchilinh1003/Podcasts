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
  isUploading: boolean = false;
  file: File | null = null;
  validateForm!: FormGroup;

  constructor(
    private dialog: DialogService,
    private af: AngularFireStorage, 
    private categoriesService: CategoriesService
  ) {}

  OnFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.file = input.files[0];
    }
}


  ngOnInit(): void {
    this.validateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      images: new FormControl('', [
        Validators.required
      ]),
      description: new FormControl(''),
    });
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
      const path = `upload/${this.newFileName}`;

      this.af.upload(path, this.file).then(() => {
        console.log('Upload Thành công');
        resolve();
      }).catch(error => {
        console.error('Upload failed:', error);
        reject(error);
      });
    });
  }

  async onCreate() {
    if (this.validateForm.invalid) {
      return;
    }
    await this.UploadImg();  
    this.isUploading = true;
    this.newCategories.images = this.newFileName;
    this.categoriesService.create(this.newCategories).subscribe({
      next: (categories: ICategories) => {
        this.categories.push(categories);
        this.newCategories = { id: '', name: '', images:'', description: '' }; 
        this.isUploading = false;
        this.dialog.success('Đã thêm thành công!');
        this.validateForm.reset();
      },
      error: error => {
        console.error('Error creating category', error);
      }
    });
  }
}
