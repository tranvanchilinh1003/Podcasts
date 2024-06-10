import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FavouriteComponent } from './favourite.component'
import { ListComponent } from './list/list.component'
import { DetailComponent } from './detail/detail.component'

const routes: Routes = [
  {
    path: '',
    component: FavouriteComponent,
    children: [
      {
        path: 'list',
        component: ListComponent,
        data: {breadcrumb: 'Danh sách'},
      },
      {
        path: 'detail/:id',
        component: DetailComponent,
        data: {breadcrumb: 'Chi tiết yêu thích'},
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class FormsRoutingModule {
}

export const routedComponents = [
  FavouriteComponent,
  ListComponent
];
