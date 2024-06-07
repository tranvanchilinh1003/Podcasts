import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'app/@core/services/apis/categories.service';
import { ICategories } from 'app/@core/interfaces/categories.interface';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'app/@core/services/common/dialog.service';
import {API_BASE_URL, API_ENDPOINT } from 'app/@core/config/api-endpoint.config';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  categories: ICategories[] = [];
  last_page: number = 0;
  current_page: number = 0;
  apiUrl = `${API_BASE_URL}${API_ENDPOINT.categories.categories}`;
  constructor(
    private dialog: DialogService,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
   
    
    this.getAll();
   
  }

  getAll() {
    this.categoriesService.getCategories().subscribe(res => {
      this.categories = res.data
      this.current_page = res.meta.current_page;
      this.last_page = res.meta.last_page;
      }, error => {
        console.log(error);
  
      })
    }

  onDelete(categoryId: string): void {
    this.dialog.showConfirmationDialog(API_ENDPOINT.categories.categories, categoryId).then((result) => {
      if (result) {
        this.categories = this.categories.filter(categories => categories.id !== categoryId);
      }
    });
  }
  getPage(event: any): void {
    this.categories = event.data
  }
}
