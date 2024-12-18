import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IPost } from 'app/@core/interfaces/post.interface';
import { PostService } from 'app/@core/services/apis/post.service';
import { SpinnerService } from "../../../@theme/components/spinner/spinner.service";
import { ICategories } from 'app/@core/interfaces/categories.interface';
import { CategoriesService } from 'app/@core/services/apis/categories.service';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { API_BASE_URL, API_ENDPOINT } from 'app/@core/config/api-endpoint.config';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  post: IPost[] = [];
  categories: ICategories[] = [];
  suggestedKeywords: string[] = [];
  editingCategory: ICategories = { id: '', name: '' };
  last_page: number = 0;
  current_page: number = 0;
  isVoiceActive: boolean = false;
  apiUrl = `${API_BASE_URL}${API_ENDPOINT.post.post}`;
  query: string = '';
  newPost: IPost = {
    id: '',
    title: '',
    description: '',
    audio: '',
    images: '',
    categories_id: '',
    customers_id: ''
  };
  constructor(
    private dialog: DialogService,
    private spinner: SpinnerService,
    private postService: PostService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private categoriesService: CategoriesService,
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getCate();
  }
  getAll() {
    this.spinner.show();
    this.postService.getPost(this.current_page).subscribe(res => {
      this.post = res.data
      this.current_page = res.meta.current_page;
      this.last_page = res.meta.last_page;
      this.spinner.hide();
    }, error => {
      console.log(error);
    })
  }
  getCate() {
    this.spinner.show();
    this.categoriesService.getCategories().subscribe(res => {
      this.categories = res.data
      // console.log(this.categories);
      this.spinner.hide();
    }, error => {
      console.log(error);

    })
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Chưa chọn loại';
  }

  // deletePost(postId: string) {
  //   if (confirm('Bạn có chắc chắn muốn xóa?')) {
  //     this.postService.deletePost(postId).subscribe({
  //       next: (response: { message: string }) => {
  //         console.log(response.message);
  //         this.getAll();
  //       },
  //       error: error => {
  //         console.error('Error deleting post', error);
  //       }
  //     });
  //   }
  // }
  onDelete(postId: string): void {
    this.dialog.showConfirmationDialog(API_ENDPOINT.post.post, postId).then((result) => {
      if (result) {
        this.post = this.post.filter(post => post.id !== postId);
      }
    });
}
  getPage(event: any): void {
    this.post = event.data
    this.current_page = event.meta.current_page;
    this.last_page = event.meta.last_page;
  }
  searchPosts() {
    this.postService.getSearch(this.query)
      .subscribe(
        (data) => {
          this.post = data.data; 
          this.current_page = data.meta.current_page;
          this.last_page = data.meta.last_page;
          
          
        },
        (error) => {
          console.error('Lỗi khi tìm kiếm bài viết:', error);
        }
      );
  }

  suggestKeywords() {
    if (this.query.length >= 1) {
      this.postService.suggestKeywords(this.query)
        .subscribe(
          (data) => {
            this.suggestedKeywords = data.data;
            console.log(data.data);
          },
          (error) => {
            console.error('Lỗi khi gợi ý từ khóa:', error);

          }
        );
    } else {
      this.suggestedKeywords = []; // Xóa danh sách gợi ý nếu không có từ khóa
    }
  }

  selectKeyword(keyword: string) {
    this.query = keyword; // Chọn từ khóa và đưa vào ô tìm kiếm
    this.suggestedKeywords = []; // Xóa danh sách gợi ý sau khi chọn từ khóa
  }


startVoiceSearch() {
  if ('webkitSpeechRecognition' in window) {
    this.isVoiceActive = true; 
    const recognition = new (window as any).webkitSpeechRecognition();  // Khởi tạo đối tượng nhận diện giọng nói
    recognition.lang = 'vi-VN';  // Cài đặt ngôn ngữ là Tiếng Việt
    recognition.continuous = false;  // Không nhận diện liên tục
    recognition.interimResults = false;  // Không nhận diện kết quả tạm thời
    recognition.maxAlternatives = 1;  // Chỉ nhận diện 1 kết quả

    recognition.start();  // Bắt đầu nhận diện giọng nói

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;  // Lấy văn bản nhận diện được
      this.query = transcript;  // Cập nhật ô tìm kiếm với văn bản nhận diện được
      this.suggestKeywords();  // Gọi hàm gợi ý từ khóa
    };

    recognition.onerror = (event: any) => {
      console.error("Lỗi nhận diện giọng nói:", event);  // Xử lý lỗi nếu có
    };
  } else {
    console.error("Trình duyệt không hỗ trợ nhận diện giọng nói.");
  }
}

stopVoiceSearch() {
  this.isVoiceActive = false;
  const recognition = new (window as any).webkitSpeechRecognition(); 
  recognition.stop();  // Dừng nhận diện giọng nói
}
}

