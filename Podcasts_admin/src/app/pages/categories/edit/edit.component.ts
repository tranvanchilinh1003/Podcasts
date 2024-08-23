import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'app/@core/services/apis/categories.service';
import { ICategories } from 'app/@core/interfaces/categories.interface';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  editingCategory: ICategories = { id: '', name: '', images: '', description: '' };
  newFileName: string = '';
  isUploading: boolean = false;
  imgUpload: string = '';
  oldImagePath: string | null = null;
  file: File | null = null;
  validateForm!: FormGroup;
  showImagePreview: boolean = true; 
  constructor(
    private dialog: DialogService,
    private af: AngularFireStorage,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.loadEditingCategory();
    this.validateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      images: new FormControl(''),
      description: new FormControl(''),
    });
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
  
    this.isUploading = true;
    const task = this.af.upload(path, this.file);
  
    await task.snapshotChanges().pipe(
      finalize(() => {
        this.isUploading = false;
      })
    ).toPromise();
  
    console.log('Cập nhật thành công, new file name:', this.newFileName);
    this.showImagePreview = true; 
  }
  

  loadEditingCategory(): void {
    let id = this.route.snapshot.params['id'];
    this.categoriesService.edit(id).subscribe({
      next: (category: { data: ICategories[] }) => {
        this.editingCategory = category.data[0];
        this.oldImagePath = this.editingCategory.images;
        this.imgUpload = `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${this.editingCategory.images}?alt=media&token=c6dc72e8-a1b0-41bb-b1f5-84f63f7397e9`;

        this.validateForm.patchValue({
          name: this.editingCategory.name,
          description: this.editingCategory.description,
        });
      },
      error: error => {
        console.error('Error fetching editing category', error);
      }
    });
  }

  async onUpdate(): Promise<void> {
    let id = this.route.snapshot.params['id'];
    if (this.validateForm.invalid) {
      return;
    }

    this.isUploading = true;

    try {
      if (this.file) {
        await this.capNhatAnh();
        this.editingCategory.images = this.newFileName;
      } else {
        this.editingCategory.images = this.oldImagePath;
      }

      this.editingCategory.name = this.validateForm.value.name;
      this.editingCategory.description = this.validateForm.value.description;
      this.categoriesService.update(id, this.editingCategory).subscribe({
        next: () => {
          this.dialog.success('Đã cập nhật thành công!');
          this.loadEditingCategory();
          this.file = null;     
        },
        error: error => {
          console.error('Error updating category', error);
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
