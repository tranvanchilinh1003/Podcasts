import { Component, OnInit } from '@angular/core';
import { FavouriteService } from 'app/@core/services/apis/favourite.service';
import { IFavourite } from 'app/@core/interfaces/favourite';
import { API_BASE_URL, API_ENDPOINT } from 'app/@core/config/api-endpoint.config';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  favourite: IFavourite[] = [];
  last_page: number = 0;
  current_page: number = 0;
  apiUrl = `${API_BASE_URL}${API_ENDPOINT.favourite.favourite}`;
  constructor(
     private favouriteService: FavouriteService
    ){}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.favouriteService.getFavourite().subscribe(res =>{
      this.favourite = res.data
      this.current_page = res.meta.current_page;
      this.last_page = res.meta.last_page;
      }, error => {
        console.log(error);
  
      })
  }
  getPage(event: any): void {
    this.favourite = event.data
  }
}
