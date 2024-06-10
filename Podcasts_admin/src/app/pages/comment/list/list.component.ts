import { Component, OnInit } from '@angular/core';
import { IComment } from 'app/@core/interfaces/comment.interface';
import { Router } from '@angular/router';
import { CommentService } from 'app/@core/services/apis/comment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  comment: IComment[] = [];
  constructor(private router: Router,
    private commentService: CommentService,
    private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.commentService.getPost().subscribe({
      next: (response: { data: IComment[] }) => {
        this.comment = response.data;
        console.log(this.comment);
      },
      error: error => {
        console.error('Error fetching categories', error);
      }
    });
  }
  detailCmt() {
    this.router.navigateByUrl('/pages/comment/detail');
    return false;
  }
  
}