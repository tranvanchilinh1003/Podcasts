import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  constructor(private router: Router){}
  ngOnInit() {}
  detailCmt() {
    this.router.navigateByUrl('/pages/comment/detail');
    return false;
  }
}
