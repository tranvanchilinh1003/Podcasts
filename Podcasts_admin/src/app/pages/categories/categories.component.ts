import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-categories',
  styleUrls: ['./categories.component.scss'],
  template: `
  <router-outlet></router-outlet>
`,
})
export class CategoriesComponent implements OnInit {
  ngOnInit(): void { }

}
