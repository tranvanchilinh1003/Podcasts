import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'app/@core/services/apis/customers.service'; 
import { ICustomer } from 'app/@core/interfaces/customers.interface';  
import { DialogService } from 'app/@core/services/common/dialog.service';
import { API_BASE_URL, API_ENDPOINT } from 'app/@core/config/api-endpoint.config'; 

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  customers: ICustomer[] = [];
  last_page: number = 0;
  current_page: number = 0;
  apiUrl = `${API_BASE_URL}${API_ENDPOINT.customers.customers}`;
  constructor(
    private dialog: DialogService,
    private CustomersService: CustomerService
    ){}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.CustomersService.getCustomer().subscribe(res =>{
      this.customers = res.data
      this.current_page = res.meta.current_page;
      this.last_page = res.meta.last_page;
      }, error => {
        console.log(error);
  
      })
  }

  onDelete(customerId: string): void {
    this.dialog.showConfirmationDialog(API_ENDPOINT.customers.customers, customerId).then((result) => {
      if (result) {
        this.customers = this.customers.filter(customers => customers.id !== customerId);
      }
    });
  }

  getPage(event: any): void {
    this.customers = event.data
  }
}
