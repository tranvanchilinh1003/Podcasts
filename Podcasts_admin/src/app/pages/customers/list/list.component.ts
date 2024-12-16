import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { CustomerService } from 'app/@core/services/apis/customers.service';
import { ICustomer } from 'app/@core/interfaces/customers.interface';
import { DialogService } from 'app/@core/services/common/dialog.service';
import {
  API_BASE_URL,
  API_ENDPOINT,
} from 'app/@core/config/api-endpoint.config';
import { SpinnerService } from 'app/@theme/components/spinner/spinner.service';
import { LocalStorageService } from '../../../@core/services/common/local-storage.service';
import { LOCALSTORAGE_KEY, ROUTER_CONFIG } from '../../../@core/config';
import { AuthService } from 'app/@core/services/apis';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  customers: ICustomer[] = [];
  customers_all: ICustomer[] = [];
  last_page: number = 0;
  current_page: number = 0;
  isVoiceActive: boolean = false;
  apiUrl = `${API_BASE_URL}${API_ENDPOINT.customers.customers}`;
  suggestedKeywords: string[] = [];
  query: string = '';
  selectedRole: string = '';
  inforAdmin;
  constructor(
    private storageService: LocalStorageService,
    readonly authService: AuthService,
    private zone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private spinner: SpinnerService,
    private dialog: DialogService,
    private CustomersService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.getAllFill();
    this.inforAdmin = this.storageService.getItem(LOCALSTORAGE_KEY.userInfo);
  }

  getAll() {
    this.spinner.show();
    this.CustomersService.getCustomer().subscribe(
      (res) => {
        this.spinner.hide();
        this.customers = res.data;
        this.current_page = res.meta.current_page;
        this.last_page = res.meta.last_page;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getAllFill() {
    this.spinner.show();
    this.CustomersService.getAll().subscribe(
      (res) => {
        this.spinner.hide();
        this.customers_all = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  filterByRole(event: any) {
    const selectedRole = event.target.value;
    this.selectedRole = selectedRole;
    if (selectedRole) {
      this.current_page = 1;
      this.last_page = 1;
      this.customers = this.customers_all.filter(
        (customer) => customer.role?.trim() == selectedRole.trim()
      );
    } else {
      this.getAll();
    }
  }

  onDelete(customerId: string): void {
    // Kiểm tra thông tin admin
    if (
      this.inforAdmin &&
      this.inforAdmin.length > 0 &&
      this.inforAdmin[0].id == customerId
    ) {
      this.dialog
        .showConfirmationDialog(API_ENDPOINT.customers.customers, customerId)
        .then((result) => {
          if (result) {
            this.onLogout();
          }
        });
    }
  
    // Xóa khách hàng
    else {
      this.dialog
        .delecustomer(customerId)
        .then((result) => {
          if (result) {
            this.customers = this.customers.filter(customers => customers.id !== customerId);
          }
        })
        .catch((error) => {
          const errorMessage = error.message || 'Đã xảy ra lỗi không xác định.';
          Swal.fire({
            icon: 'error',
            title: 'Có lỗi xảy ra!',
            text: `Lỗi: ${errorMessage}`,
          });
        });
    }
  }
  

  getPage(event: any): void {
    this.customers = event.data;
    this.current_page = event.meta.current_page;
    this.last_page = event.meta.last_page;
  }

  searchCustomer() {
    this.CustomersService.getSearch(this.query).subscribe(
      (data) => {
        console.log(data);
        this.customers = data.data.data;
        this.current_page = data.meta.current_page;
        this.last_page = data.meta.last_page;
      },
      (error) => {
        console.error('Lỗi khi tìm kiếm khách hàng:', error);
      }
    );
  }

  suggestKeywords() {
    if (this.query.length >= 1) {
      this.CustomersService.suggestKeywords(this.query).subscribe(
        (data) => {
          console.log(data.data);
          this.suggestedKeywords = data.data;
        },
        (error) => {
          console.error('Lỗi khi gợi ý từ khóa:', error);
        }
      );
    } else {
      this.suggestedKeywords = [];
    }
  }

  selectKeyword(keyword: string) {
    this.query = keyword; // Chọn từ khóa và đưa vào ô tìm kiếm
    this.suggestedKeywords = []; // Xóa danh sách gợi ý sau khi chọn từ khóa
  }

  startVoiceSearch() {
    if ('webkitSpeechRecognition' in window) {
      this.isVoiceActive = true;
      const recognition = new (window as any).webkitSpeechRecognition(); // Khởi tạo đối tượng nhận diện giọng nói
      recognition.lang = 'vi-VN'; // Cài đặt ngôn ngữ là Tiếng Việt
      recognition.continuous = false; // Không nhận diện liên tục
      recognition.interimResults = false; // Không nhận diện kết quả tạm thời
      recognition.maxAlternatives = 1; // Chỉ nhận diện 1 kết quả

      recognition.start(); // Bắt đầu nhận diện giọng nói

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript; // Lấy văn bản nhận diện được
        this.query = transcript; // Cập nhật ô tìm kiếm với văn bản nhận diện được
        this.suggestKeywords(); // Gọi hàm gợi ý từ khóa
      };

      recognition.onerror = (event: any) => {
        console.error('Lỗi nhận diện giọng nói:', event); // Xử lý lỗi nếu có
      };
    } else {
      console.error('Trình duyệt không hỗ trợ nhận diện giọng nói.');
    }
  }

  stopVoiceSearch() {
    this.isVoiceActive = false;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.stop(); // Dừng nhận diện giọng nói
  }

  onLogout() {
    this.authService.logout().subscribe(
      () => {
        this.dialog.success('Đăng xuất thành công');
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
