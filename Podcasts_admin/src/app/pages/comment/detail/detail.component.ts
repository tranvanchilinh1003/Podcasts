import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IComment } from 'app/@core/interfaces/comment.interface';
import { CommentService } from 'app/@core/services/apis/comment.service';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { API_ENDPOINT } from 'app/@core/config/api-endpoint.config';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  commentId: string;
  comment: IComment = {
    id: '',
    rating: '',
    contents: ''
  };

  constructor(
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,

  ) { }

  ngOnInit(): void {
    this.getPost();
  }
  getPost() {
    let id = this.route.snapshot.params['id'];
    this.commentService.getPostById(id).subscribe({
      next: (response: { data: IComment}) => {
        this.comment = response.data;
      },
    });
  }
  deleteComment(commentId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: (response: { message: string }) => {
          this.getPost(); 
        },
      });
    }
  }
  onDelete(commentId: string): void {
    this.dialog.showConfirmationDialog(API_ENDPOINT.comment.comment, commentId).then((result) => {
      if (result) {
        this.comment = this.comment.filter(comment => comment.id !== commentId);
      }
    });
  }
}
