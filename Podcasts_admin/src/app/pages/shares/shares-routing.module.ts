import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharesComponent } from './shares.component'
import { ListComponent } from './list/list.component'
import { DetailComponent } from './detail/detail.component'

const routes: Routes = [
  {
    path: '',
    component: SharesComponent,
    children: [
      {
        path: 'list',
        component: ListComponent,
        data: {breadcrumb: 'Danh sách'},
      },
      {
        path: 'detail/:id',
        component: DetailComponent,
        data: {breadcrumb: 'Chi tiết chia sẻ'},
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
  SharesComponent,
  ListComponent
];
