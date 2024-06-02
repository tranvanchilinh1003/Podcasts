import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesComponent } from './categories.component';
import {CreateComponent} from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: 'create',
        component: CreateComponent,
        data: {breadcrumb: 'Thêm mới'},
      },
      {
        path: 'edit/:id',
        component: EditComponent,
        data: {breadcrumb: 'Sửa'},
      },
      {
        path: 'list',
        component: ListComponent,
        data: {breadcrumb: 'Danh sách'},
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
  CategoriesComponent,
  CreateComponent,
  ListComponent
];
