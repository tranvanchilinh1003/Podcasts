import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'app/@core/services/apis/categories.service';
import { ICategories } from 'app/@core/interfaces/categories.interface';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { SpinnerService } from 'app/@theme/components/spinner/spinner.service';
import { API_BASE_URL, API_ENDPOINT } from 'app/@core/config/api-endpoint.config';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  categories: ICategories[] = [];
  newCategories: ICategories = { id: '', name: '', order:'',  images: '', description: '' };
  newFileName: string = '';
  imgUpload: string = '';
  isUploading: boolean = false;
  file: File | null = null; 
  validateForm!: FormGroup;
  current_page: number = 0;

  last_page: number = 0;
  apiUrl = `${API_BASE_URL}${API_ENDPOINT.categories.categories}`;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: DialogService,
    private af: AngularFireStorage,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.validateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      images: new FormControl('', Validators.required),
      description: new FormControl('')
    });
    this.getAll();
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
    try {
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
          this.getAll();
        },
        error: error => {
          console.error('Error creating category', error);
        }
      });
    } catch (error) {
      console.error('Error uploading image', error);
    }
  }

  getAll() {
    this.spinner.show();
    this.categoriesService.getAllCategories().subscribe(res => {
      this.spinner.hide();
      this.categories = res.data;
      this.current_page = res.meta.current_page;
      this.last_page = res.meta.last_page;
    }, error => {
      this.spinner.hide();
      console.error(error);
    });
  }

  onDelete(categoryId: string): void {
    this.dialog.showConfirmationDialog(API_ENDPOINT.categories.categories, categoryId).then((result) => {
      if (result) {
        this.categories = this.categories.filter(category => category.id !== categoryId);
        this.getAll();
      }
    });
  }

  getPage(event: any): void {
    this.categories = event.data;
    this.current_page = event.meta.current_page;
    this.last_page = event.meta.last_page;
  }

  onDrop(event: CdkDragDrop<ICategories[]>): void {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    this.categories = this.categories.map((category, index) => ({
      ...category,
      order: index.toString()
    }));
  
    this.categoriesService.updateCategoryOrder(this.categories).subscribe({
      next: () => console.log('Cập nhật thứ tự thành công'),
      error: (error) => console.error('Cập nhật thứ tự thất bại', error),
    });
  }
}  
