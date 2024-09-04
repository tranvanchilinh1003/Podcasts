import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-tinymce-editor',
  template: `
    <div class="editor-container bg-transparent">
      <quill-editor [styles]="editorStyles" [modules]="editorModules" [(ngModel)]="editorContent"></quill-editor>
    </div>
    <input  type="hidden" class=" bg-transparent" id="mytextarea" [(ngModel)]="editorContent" (ngModelChange)="onEditorContentChange($event)" />

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

  constructor() {}

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
  }

  editorStyles = {
    height: '200px'
  };
}
