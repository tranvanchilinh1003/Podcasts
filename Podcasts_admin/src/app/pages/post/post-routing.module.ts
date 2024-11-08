import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostComponent } from './post.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component'
import { EditComponent } from './edit/edit.component'
import { PreviewComponent } from './preview-article/preview-artivle.component';
const routes: Routes = [{
    path: '',
    component: PostComponent,
    children: [
        {
            path: 'create',
            component: CreateComponent,
            data: {breadcrumb: 'Thêm'},
        },
        {
            path: 'list',
            component: ListComponent,
            data: {breadcrumb: 'Danh sách'},
        },
        {
            path: 'edit/:id',
            component: EditComponent,
            data: {breadcrumb: 'Sửa'},
        },
        {
            path: 'preview-article/:id',
            component: PreviewComponent,
            data: {breadcrumb: 'Xem trước'},
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PostRoutingModule { }

export const routedComponents = [
    PostComponent,
    CreateComponent,
    ListComponent,
    EditComponent,
    PreviewComponent
];
