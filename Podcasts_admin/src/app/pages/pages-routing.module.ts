import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import { CategoriesComponent } from './categories/categories.component';



const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
      data: {breadcrumb: 'Giới thiệu'},
    },
    {
      path: 'categories',
      loadChildren: () => import('./categories/categories.module')
      .then(m => m.CategoriesModule),
      data: {breadcrumb: 'Loại'},
    },
    {
      path: 'comment',
      loadChildren: () => import('./comment/comment.module')
      .then(m => m.CommentModule),
      data: {breadcrumb: 'Bình luận'},
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
