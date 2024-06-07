import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from "./dashboard/dashboard.component";




const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      component: DashboardComponent,
      data: {breadcrumb: 'Trang chủ'},
    },
    {
      path: 'categories',
      loadChildren: () => import('./categories/categories.module')
      .then(m => m.CategoriesModule),
      data: {breadcrumb: 'Thể loại'},  
    },
    {
      path: 'customers',
      loadChildren: () => import('./customers/customers.module')
        .then(m => m.CustomersModule),
        data: {breadcrumb: 'Khách hàng'},
    },
    {
      path: 'post',
      loadChildren: () => import('./post/post.module')
        .then(m => m.PostModule),
        data: {breadcrumb: 'Bài đăng'},
    },
    {
      path: 'comment',
      loadChildren: () => import('./comment/comment.module')
      .then(m => m.CommentModule),
      data: {breadcrumb: 'Bình luận'},
    },
    {
      path: 'shares',
      loadChildren: () => import('./shares/shares.module')
      .then(m => m.SharesModule),
      data: {breadcrumb: 'Chia sẻ'},
    },
    {
      path: 'favourite',
      loadChildren: () => import('./favourite/favourite.module')
      .then(m => m.FavouriteModule),
      data: {breadcrumb: 'Yêu thích'},
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      data: { breadcrumb: 'Hồ sơ' },
    },
    {
      path: 'profile/edit',
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      data: { breadcrumb: 'Hồ sơ' },
    },

  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
  
}
