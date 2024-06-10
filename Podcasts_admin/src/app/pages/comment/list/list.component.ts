import { Component, OnInit } from '@angular/core';
import { IComment } from 'app/@core/interfaces/comment.interface';
import { Router } from '@angular/router';
import { CommentService } from 'app/@core/services/apis/comment.service';
import { ActivatedRoute } from '@angular/router';
import { API_BASE_URL, API_ENDPOINT } from 'app/@core/config/api-endpoint.config';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  comment: IComment[] = [];
  last_page: number = 0;
  current_page: number = 0;
  apiUrl = `${API_BASE_URL}${API_ENDPOINT.comment.comment}`;
  constructor(private router: Router,
    private commentService: CommentService,
    private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.commentService.getPost().subscribe(res =>{
      this.comment = res.data
      this.current_page = res.meta.current_page;
      this.last_page = res.meta.last_page;
      }, error => {
        console.log(error);
  
      })
  }
  detailCmt() {
    this.router.navigateByUrl('/pages/comment/detail');
    return false;
  }
  getPage(event: any): void {
    this.comment = event.data
  }
}