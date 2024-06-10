import { Component, OnInit } from '@angular/core';
import { SharesService } from 'app/@core/services/apis/shares.service';
import { IShares } from 'app/@core/interfaces/shares';
import { API_BASE_URL, API_ENDPOINT } from 'app/@core/config/api-endpoint.config';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  shares: IShares[] = [];
  last_page: number = 0;
  current_page: number = 0;
  apiUrl = `${API_BASE_URL}${API_ENDPOINT.shares.shares}`;
  constructor(
     private sharesService: SharesService
    ){}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.sharesService.getShares().subscribe(res =>{
      this.shares = res.data
      this.current_page = res.meta.current_page;
      this.last_page = res.meta.last_page;
      }, error => {
        console.log(error);
  
      })
  }

  getPage(event: any): void {
    this.shares = event.data
  }
}
