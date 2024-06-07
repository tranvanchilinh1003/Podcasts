import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'app/@core/services/apis/categories.service';
import { ICategories } from 'app/@core/interfaces/categories.interface';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'app/@core/services/common/dialog.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  editingCategory: ICategories = { id: '', name: '' };
  successMessage: string | null = null; 
  validateForm!: FormGroup;

  constructor(
    private dialog: DialogService,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.loadEditingCategory();
    this.validateForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  loadEditingCategory(): void {
    let id = this.route.snapshot.params['id'];
    this.categoriesService.edit(id).subscribe({
      next: (category: { data: ICategories[] }) => {
        this.editingCategory = category.data[0];
      },
      error: error => {
        console.error('Error fetching editing category', error);
      }
    }); 
  }

  onUpdate(): void {
    let id = this.route.snapshot.params['id'];
    if (this.validateForm.invalid) {
      return;
    }

    this.categoriesService.update(id, this.editingCategory).subscribe({
      next: () => {
        this.dialog.success('Đã cập nhật thành công!');
        this.loadEditingCategory();
      },
      error: error => {
        console.error('Error updating category', error);
      }
    });
  }
}
