import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CreateComponent {
  constructor(private af: AngularFireStorage) {}

  file: File;

  OnFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.file = input.files[0];
    }
  }

  UploadImg(): void {
    if (!this.file) {
      console.error('No file selected');
      return;
    }
    const fileExtension = this.file.name.split('.').pop();
    const currentDate = new Date();
    const newFileName = `${currentDate.toISOString().trim()}.${fileExtension}`;
    console.log(newFileName);
    const path = `upload/${newFileName}`;

    this.af.upload(path, this.file).then(() => {
      console.log('Upload Thành công');
    }).catch(error => {
      console.error('Upload failed:', error);
    });
  }

  
}
