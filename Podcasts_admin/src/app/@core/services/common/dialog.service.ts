import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../config/api-endpoint.config';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private httpService: HttpClient) { }

  showConfirmationDialog(item: string, id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ms-2',
        cancelButton: 'btn btn-danger '
      },
      buttonsStyling: false
    });

    return swalWithBootstrapButtons.fire({
      title: 'Bạn có muốn xóa?',
      text: "Suy nghĩ kỹ trước khi xóa!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, Xóa',
      cancelButtonText: 'Thoát!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteItem(item, id).subscribe(
          () => {
            
            swalWithBootstrapButtons.fire({
                title: 'Đã Xóa!',
                text: 'Bạn đã xóa thành công.',
                icon: 'success'
              });
          },
          (error) => {
            console.error('Lỗi khi xóa:', error);
            swalWithBootstrapButtons.fire({
                title: 'Lỗi!',
                text: 'Xóa không thành công. Vui lòng thử lại sau.',
                icon: 'error'
              });
          }
        );
        setTimeout(() => {
          Swal.close();
        }, 2500);
      }
    
    });
  }



  
  deleteItem(item: string, id: string): Observable<any> {
    return this.httpService.delete<any>(`${API_BASE_URL}${item}/${id}`);
  }
}
