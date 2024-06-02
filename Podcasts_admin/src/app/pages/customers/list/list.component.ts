import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'app/@core/services/apis/customers.service'; 
import { ICustomer } from 'app/@core/interfaces/customers.interface';  
import { DialogService } from 'app/@core/services/common/dialog.service';
import { API_ENDPOINT } from 'app/@core/config/api-endpoint.config'; 

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  customers: ICustomer[] = [];
 
  constructor(
    private dialog: DialogService,
    private CustomersService: CustomerService
    ){}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.CustomersService.getCustomer().subscribe({
      next: (response: { data: ICustomer[] }) => {
        this.customers = response.data;        
      },
      error: error => {
        console.error('Error fetching Customers', error);
      }
    });
  }

  onDelete(customerId: string): void {
    this.dialog.showConfirmationDialog(API_ENDPOINT.categories.categories, customerId).then((result) => {
      if (result) {
        this.customers = this.customers.filter(customers => customers.id !== customerId);
      }
    });
  }
}
