import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IPost } from 'app/@core/interfaces/post.interface';
import { PostService } from 'app/@core/services/apis/post.service';
import { SpinnerService } from "../../../@theme/components/spinner/spinner.service";
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
  suggestedKeywords: string[] = [];
  last_page: number = 0;
  current_page: number = 0;
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
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.spinner.show();
    this.postService.getPost().subscribe(res =>{
      this.post = res.data
      this.current_page = res.meta.current_page;
      this.last_page = res.meta.last_page;
      this.spinner.hide();
      }, error => {
        console.log(error);
      })
  }
  deletePost(postId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.postService.deletePost(postId).subscribe({
        next: (response: { message: string }) => {
          console.log(response.message);
          this.getAll(); 
        },
        error: error => {
          console.error('Error deleting post', error);
        }
      });
    }
  }
  onDelete(postId: string): void {
    this.dialog.showConfirmationDialog(API_ENDPOINT.post.post, postId).then((result) => {
      if (result) {
        this.post = this.post.filter(post => post.id !== postId);
      }
    });
  }
  getPage(event: any): void {
    this.post = event.data
  }
  searchPosts() {
    this.postService.getSearch(this.query)
      .subscribe(
        (data) => {
          this.post = data.data; 
          // console.log(data.data);
          
          
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

}
