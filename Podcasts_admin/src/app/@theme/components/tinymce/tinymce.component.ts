import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Chỉ import HttpClient tại đây
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-tinymce-editor',
  template: `
    <div class="editor-container bg-transparent">
      <quill-editor [styles]="editorStyles" [modules]="editorModules" [(ngModel)]="editorContent" (ngModelChange)="onEditorContentChange($event)"></quill-editor>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TinymceEditorComponent),
      multi: true
    }
  ]
})
export class TinymceEditorComponent implements ControlValueAccessor {
  @Input() editorContent: string = ' ';
  @Output() editorContentChange = new EventEmitter<string>();

  editorModules: any = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private http: HttpClient) {} // Thêm HttpClient ở đây

  writeValue(value: string): void {
    this.editorContent = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onEditorContentChange(newValue: string): void {
    this.editorContent = newValue;
    this.onChange(newValue);
    this.editorContentChange.emit(newValue);
    this.onTouched();
    this.saveContent(newValue); // Gọi hàm lưu dữ liệu khi có thay đổi
  }

  // Hàm để lưu dữ liệu vào cơ sở dữ liệu
  saveContent(content: string): void {
    const apiUrl = 'http://localhost:8080/api/post'; // Thay bằng đúng URL của bạn
    this.http.post(apiUrl, { description: content }).pipe(
      catchError(error => {
        console.error('Error saving content', error);
        return throwError(error);
      })
    ).subscribe(response => {
      console.log('Content saved successfully', response);
    });
  }


  editorStyles = {
    height: '200px'
  };
}
