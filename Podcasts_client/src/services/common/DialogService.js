import axios from 'axios';
import Swal from 'sweetalert2';


const API_BASE_URL = 'http://localhost:4200/api/'
export const DialogService = {
  success(title) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500
    });
  },

  error(message) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2000
    });
  },

  showConfirmationDialog(item, id) {
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
        return this.deleteItem(item, id)
          .then(() => {
            swalWithBootstrapButtons.fire({
              title: 'Đã Xóa!',
              text: 'Bạn đã xóa thành công.',
              icon: 'success'
            });
            return true;
          })
          .catch((error) => {
            console.error('Lỗi khi xóa:', error);
            swalWithBootstrapButtons.fire({
              title: 'Lỗi!',
              text: 'Xóa không thành công. Vui lòng thử lại sau.',
              icon: 'error'
            });
            return false;
          });
      } else {
        return false;
      }
    });
  },

  deleteItem(item, id) {
    return axios.delete(`${API_BASE_URL}${item}/${id}`);
  }
};
