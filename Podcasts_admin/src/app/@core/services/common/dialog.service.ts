import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

import { API_BASE_URL, API_ENDPOINT } from '../../config/api-endpoint.config';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private httpService: HttpClient) { }
  success(title: string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500
    });
  }

  error(message: string): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2000
    });
  }

  showConfirmationDialog(item: string, id: string): Promise<boolean> {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ms-2',
        cancelButton: 'btn btn-danger'
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
        return this.deleteItem(item, id).toPromise().then(
          () => {
            swalWithBootstrapButtons.fire({
              title: 'Đã Xóa!',
              text: 'Bạn đã xóa thành công.',
              icon: 'success'
            });
            return true;
          },
          (error) => {
            console.error('Lỗi khi xóa:', error);
            swalWithBootstrapButtons.fire({
              title: 'Lỗi!',
              text: 'Xóa không thành công. Vui lòng thử lại sau.',
              icon: 'error'
            });
            return false;
          }
        );
      } else {
        return false;
      }
    });
  }
  
  async delecustomer(id: string): Promise<boolean> {
    const { value: reason } = await Swal.fire({
      title: 'Vui lòng nhập lý do xóa tài khoản',
      input: 'textarea',
      inputPlaceholder: 'Nhập lý do...',
      showCancelButton: true,
      confirmButtonText: 'Gửi lý do',
      inputAttributes: {
        'aria-label': 'Nhập lý do xóa tài khoản',
        style: 'width: auto; height: 150px; font-size: 14px;'
        
      },
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const reason = Swal.getInput().value;
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Lý do xóa tài khoản là bắt buộc');
          return false;
        }
  
        try {
          const deleteResponse: any = await firstValueFrom(
            this.httpService.delete(`${API_ENDPOINT.auth.base}/customers/${id}`, {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reason }) 
            })
          );
  
          Swal.fire({
            icon: 'success',
            title: 'Tài khoản đã được xóa!',
            text: `Lý do xóa tài khoản: ${reason}`,
          });
          return true; 
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
          Swal.showValidationMessage(`Lỗi: ${error.message}`);
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  
    return false; 
  }
  
  deleteItem(item: string, id: string): Observable<any> {
    return this.httpService.delete<any>(`${API_BASE_URL}${item}/${id}`);
  }

  
}
