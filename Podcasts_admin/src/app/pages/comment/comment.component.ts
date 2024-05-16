import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment',
  styleUrls: ['./comment.component.scss'],
  template: `
  <router-outlet></router-outlet>
`,
 
})
export class CommentComponent implements OnInit {
  ngOnInit(): void { }

}
