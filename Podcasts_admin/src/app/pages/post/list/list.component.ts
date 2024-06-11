import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IPost } from 'app/@core/interfaces/post.interface';
import { PostService } from 'app/@core/services/apis/post.service';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { API_BASE_URL, API_ENDPOINT } from 'app/@core/config/api-endpoint.config';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  post: IPost[] = [];
  last_page: number = 0;
  current_page: number = 0;
  apiUrl = `${API_BASE_URL}${API_ENDPOINT.post.post}`;
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
    private postService: PostService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.postService.getPost().subscribe(res =>{
      this.post = res.data
      this.current_page = res.meta.current_page;
      this.last_page = res.meta.last_page;
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
}
