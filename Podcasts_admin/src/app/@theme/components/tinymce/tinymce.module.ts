import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { TinymceEditorComponent } from './tinymce.component';

@NgModule({
  declarations: [
    TinymceEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    QuillModule.forRoot()
  ],
  exports: [
    TinymceEditorComponent
  ]
})
export class TinymceModule { }
