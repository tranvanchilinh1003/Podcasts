import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private customerData: any = null;
  private postData: any = null;

  setCustomerData(data: any) {
    this.customerData = data;
  }

  getCustomerData() {
    return this.customerData;
  }

  setPostData(data: any) {
    this.postData = data;
  }

  getPostData() {
    return this.postData;
  }
}
