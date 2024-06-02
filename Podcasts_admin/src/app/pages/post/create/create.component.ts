import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  fileAudio: File | null = null;
  fileImg: File | null = null;
  uploadProgressAudio: number = 0;
  uploadProgressImage: number = 0;
  isUploading: boolean = false;
  constructor(private storage: AngularFireStorage) { }

  onFileChange(event: any, fileType: string): void {
    const file = event.target.files[0];
    if (fileType === 'audio') {
      this.fileAudio = file;
    } else if (fileType === 'image') {
      this.fileImg = file;
    }
  }

  upload(): void {
    if (!this.fileAudio || !this.fileImg) {
      console.error('No file selected');
      return;
    }
    this.isUploading = true;
    const uploadFile = (file: File, path: string, progressCallback: (progress: number) => void): Promise<void> => {
      const task = this.storage.upload(path, file);
      return new Promise((resolve, reject) => {
        task.percentageChanges().subscribe(progress => {
          progressCallback(progress || 0);
        });
        task.then(() => resolve()).catch(error => reject(error));
      });
    };

    const fileExtensionAudio = this.fileAudio.name.split('.').pop();
    const fileExtensionImg = this.fileImg.name.split('.').pop();
    const currentDate = new Date();
    const newFileName = `${currentDate.toISOString().trim()}`;
    const pathAudio = `audio/${newFileName}.${fileExtensionAudio}`;
    const pathImg = `upload/${newFileName}.${fileExtensionImg}`;

    Promise.all([
      uploadFile(this.fileAudio, pathAudio, (progress) => this.uploadProgressAudio = progress),
      uploadFile(this.fileImg, pathImg, (progress) => this.uploadProgressImage = progress)
    ]).then(() => {
      console.log('Upload thành công');
      this.isUploading = false;
    }).catch(error => {
      console.error('Upload failed:', error);
      this.isUploading = false;
    });
  }
}