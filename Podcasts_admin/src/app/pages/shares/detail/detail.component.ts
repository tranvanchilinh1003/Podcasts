import { Component, OnInit } from '@angular/core';
import { IDetail } from 'app/@core/interfaces/shares';
import { DetailService } from 'app/@core/services/apis/shares.service';
import { DialogService } from 'app/@core/services/common/dialog.service'; 
import { API_ENDPOINT } from 'app/@core/config/api-endpoint.config';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  detail: IDetail[] = [];
  listShares: IDetail[] = [];
 
  constructor(
    private dialog: DialogService,
    private detailService: DetailService
   ){}
  
  ngOnInit(): void {
   this.getAllDetail();
  }
  
 getAllDetail() {
    this.detailService.getDetail().subscribe({
      next: (response: { data: IDetail[] }) => {
        this.detail = response.data;
        console.log(this.detail);
      },
      error: error => {
        console.error('Error fetching detail', error);
      }
    });
  }
  onDelete(sharesId: string): void {
    this.dialog.showConfirmationDialog(API_ENDPOINT.shares.list, sharesId).then((result) => {
      if (result) {
        this.listShares = this.listShares.filter(shares => shares.id !== sharesId);
      }
    });
  }
}
