import { Component, OnInit } from '@angular/core';
import { FavouriteService } from 'app/@core/services/apis/favourite.service';
import { IFavourite } from 'app/@core/interfaces/favourite';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  favourite: IFavourite[] = [];
 
  constructor(
     private favouriteService: FavouriteService
    ){}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.favouriteService.getFavourite().subscribe({
      next: (response: { data: IFavourite[] }) => {
        this.favourite = response.data;        
        console.log(this.favourite);
        
      },
      error: error => {
        console.error('Error fetching favourite', error);
      }
    });
  }
}
