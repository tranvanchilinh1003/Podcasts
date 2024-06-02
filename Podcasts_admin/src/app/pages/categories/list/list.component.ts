import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'app/@core/services/apis/categories.service'; 
import { ICategories } from 'app/@core/interfaces/categories.interface'; 
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { API_ENDPOINT } from 'app/@core/config/api-endpoint.config'; 

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  categories: ICategories[] = [];
 
  constructor(
    private dialog: DialogService,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
    ){}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.categoriesService.getCategories().subscribe({
      next: (response: { data: ICategories[] }) => {
        this.categories = response.data;        
      },
      error: error => {
        console.error('Error fetching categories', error);
      }
    });
  }

  onDelete(categoryId: string): void {   
    this.dialog.showConfirmationDialog(API_ENDPOINT.customers.customers, categoryId).then((result) => {
      if (result) {
        this.categories = this.categories.filter(categories => categories.id !== categoryId);
      }
    });
  }

}
