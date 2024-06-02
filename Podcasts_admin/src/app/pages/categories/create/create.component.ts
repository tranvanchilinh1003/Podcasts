import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'app/@core/services/apis/categories.service'; 
import { ICategories } from 'app/@core/interfaces/categories.interface'; 
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'app/@core/services/common/dialog.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  categories: ICategories[] = [];
  newCategories: ICategories = { id: '', name: '' };
  validateForm!: FormGroup;

  constructor(
    private dialog: DialogService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.validateForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  onCreate() {
    if (this.validateForm.invalid) {
      return;
    }

    this.categoriesService.create(this.newCategories).subscribe({
      next: (categories: ICategories) => {
        this.categories.push(categories);
        this.newCategories = { id: '', name: '' }; 
        this.dialog.success('Đã thêm thành công!');
        this.validateForm.reset();
      },
      error: error => {
        console.error('Error creating category', error);
      }
    });
  }
}
