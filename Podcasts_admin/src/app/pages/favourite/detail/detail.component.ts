import { Component, OnInit } from '@angular/core';
import { DetailService } from 'app/@core/services/apis/favourite.service';
import { IDetail } from 'app/@core/interfaces/favourite';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { API_ENDPOINT } from 'app/@core/config/api-endpoint.config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  detail: IDetail[] = [];


  constructor(
    private dialog: DialogService,
    private detailService: DetailService,
    private route: ActivatedRoute,
   ){}

   ngOnInit(): void {
    this.getAllDetail();
   }
  getAllDetail() {
    let id = this.route.snapshot.params['id'];

    this.detailService.getDetail(id).subscribe({
      next: (response: { data: IDetail[] }) => {
        this.detail = response.data;
        console.log(this.detail);
      },
      error: error => {
        console.error('Error fetching detail', error);
      }
    });
  }
  onDelete(favouriteId: string): void {
    this.dialog.showConfirmationDialog(API_ENDPOINT.favourite.favourite, favouriteId).then((result) => {
      if (result) {
        this.detail = this.detail.filter(favourite => favourite.id !== favouriteId);
      }
    });
  }
}
