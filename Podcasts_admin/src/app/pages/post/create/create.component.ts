import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPost } from 'app/@core/interfaces/post.interface';
import { PostService } from 'app/@core/services/apis/post.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CategoriesService } from 'app/@core/services/apis/categories.service';
import { ICategories } from 'app/@core/interfaces/categories.interface';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { LocalStorageService } from "../../../@core/services/common/local-storage.service";
import { LOCALSTORAGE_KEY } from "../../../@core/config";
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  postForm!: FormGroup;
  fileAudio: File | null = null;
  isPlaying: boolean = false; 
  fileImg: File | null = null;
  uploadProgressAudio: number = 0;
  uploadProgressImage: number = 0;
  isUploading: boolean = false;
  categories: ICategories[] = [];
  post: IPost[] = [];
  newFileName: string = '';
  private fileExtensionImg: string;
  private fileExtensionAudio: string;
  imgPreview: string | ArrayBuffer | null = null;
  waveform: WaveSurfer | null = null;
  postnew: IPost = {
    id: '',
    title: '',
    images: '',
    audio: '',
    description: '',
    categories_id: '',
    customers_id: '',
    action: ''
  };

  constructor(
    private localStorageService: LocalStorageService,
    private dialog: DialogService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private categoriesService: CategoriesService
  ) {
    this.fileExtensionAudio = '';
    this.newFileName = '';
    this.fileExtensionImg = ' ';
  }

  ngOnInit(): void {
    this.getCate();
    this.postForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(8)]),
      description: new FormControl(''),
      categories_id: new FormControl('', [Validators.required]),
      images: new FormControl('', [Validators.required]),
      audio: new FormControl('', [Validators.required]),
      customers_id: new FormControl(''),
    });
  
    this.waveform = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'lightgray',
      progressColor: 'blue',
      height: 100,
    });
  
    this.waveform.load('assets/audio/banhduc.mp3');
  
    this.waveform.on('finish', () => {
      this.isPlaying = false;
    });
  }
  

  onFileChange(event: any, fileType: string): void {
    const file = event.target.files[0];
  
    if (fileType === 'audio') {
      if (file) {
        this.fileAudio = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.waveform?.load(e.target.result); // Tải sóng âm từ tệp
        };
        reader.readAsDataURL(file);
      } else {
        this.fileAudio = null; // Không có file thực tế
        this.waveform?.load('assets/audio/banhduc.mp3'); // Tải sóng âm mặc định
      }
    } else if (fileType === 'image') {
      if (file) {
        this.fileImg = file;
  
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imgPreview = e.target.result; // Hiển thị hình ảnh
        };
        reader.readAsDataURL(this.fileImg);
      }
    }
  }
  

  triggerFileInput(fileType: string): void {
    const input = document.getElementById(fileType) as HTMLInputElement;
    input?.click();
  }
  

  playPauseAudio(): void {
    if (this.waveform) {
      this.waveform.playPause();
      this.isPlaying = !this.isPlaying;
    }
  }


  upload(): void {
    if (!this.fileImg) {
      console.error('Chưa thêm file hình ảnh');
      return;
    }
  
    const currentDate = new Date();
    this.newFileName = `${currentDate.toISOString().trim()}`;
    const pathImg = `upload/${this.newFileName}.${this.fileExtensionImg}`;
    
    // Nếu không có tệp âm thanh, sử dụng đường dẫn mặc định
    const pathAudio = this.fileAudio
      ? `audio/${this.newFileName}.${this.fileExtensionAudio}`
      : 'assets/audio/banhduc.mp3';
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

  
    const uploadTasks = [
      uploadFile(this.fileImg, pathImg, (progress) => (this.uploadProgressImage = progress)),
    ];
  
    if (this.fileAudio) {
      uploadTasks.push(
        uploadFile(this.fileAudio, pathAudio, (progress) => (this.uploadProgressAudio = progress))
      );
    }
  
    Promise.all(uploadTasks)
      .then(() => {
        this.dialog.success('Đã thêm thành công!');
        this.isUploading = false;
  
        this.postForm.patchValue({
          images: `${this.newFileName}.${this.fileExtensionImg}`,
          audio: this.fileAudio ? `${this.newFileName}.${this.fileExtensionAudio}` : pathAudio,
        });
      })
      .catch((error) => {
        console.error('Tải lên thất bại:', error);
        this.isUploading = false;
      });
  }

  async onCreate(): Promise<void> {
    const customerIdRaw = this.localStorageService.getItem(LOCALSTORAGE_KEY.userInfo);
    const customerId = customerIdRaw[0].id;

    if (this.postForm.invalid) {
      return;
    }

    try {
      // Chờ quá trình upload hoàn tất
      await this.upload();

      this.postnew.images = `${this.newFileName}.${this.fileExtensionImg}`;
      this.postnew.audio = `${this.newFileName}.${this.fileExtensionAudio}`;
      this.postnew.customers_id = customerId;
      this.postnew.action = 1;
      this.postnew.description = this.postForm.get('description')!.value;

      this.postService.createPost(this.postnew).subscribe({
        next: (post: IPost) => {
          this.post.push(post);
          this.postForm.reset();
        },
        error: error => {
          console.error('Error creating post', error);
        }
      });

    } catch (error) {
      console.error('Error uploading image', error);
    }
  }

  getCate() {
    this.categoriesService.getAllCategories().subscribe(res => {
      this.categories = res.data;
    }, error => {
      console.log(error);
    });
  }
}
