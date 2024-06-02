import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../../../@core/services/apis/customers.service';
import { IUser } from '../../../@core/interfaces/customers.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  customers: IUser[] = [];

  constructor(private customersService: CustomersService) {}

  ngOnInit(): void {
    this.customersService.getAllPosts().subscribe(
      (data) => {
        this.customers = data;
        console.log('Successfully fetched customers:', this.customers);
      },
      (error) => {
        console.error('Error fetching customers:', error);

      }
    );
  }
}
