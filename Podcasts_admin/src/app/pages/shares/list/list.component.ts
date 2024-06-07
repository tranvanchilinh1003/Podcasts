import { Component, OnInit } from '@angular/core';
import { SharesService } from 'app/@core/services/apis/shares.service';
import { IShares } from 'app/@core/interfaces/shares';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  shares: IShares[] = [];
 
  constructor(
     private sharesService: SharesService
    ){}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.sharesService.getShares().subscribe({
      next: (response: { data: IShares[] }) => {
        this.shares = response.data;        
        console.log(this.shares);
        
      },
      error: error => {
        console.error('Error fetching share', error);
      }
    });
  }
}
