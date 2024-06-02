import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../../@core/services/common/dialog.service'
import {API_BASE_URL, API_ENDPOINT} from "../../../@core/config/api-endpoint.config";
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  constructor(private router: Router, private dialogService: DialogService){}
  ngOnInit() {}
  detail() {
    this.router.navigateByUrl('/pages/categories/edit');
    return false;
  }
  showDialog(id: string) {
    this.dialogService.showConfirmationDialog(API_ENDPOINT.customers.list, id);

  }
}
