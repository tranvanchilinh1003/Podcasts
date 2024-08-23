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


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  postForm!: FormGroup;
  fileAudio: File | null = null;
  fileImg: File | null = null;
  uploadProgressAudio: number = 0;
  uploadProgressImage: number = 0;
  isUploading: boolean = false;
  categories: ICategories[] = [];
  post: IPost[] = [];
  newFileName: string = '';
  private fileExtensionImg: string;
  private fileExtensionAudio: string;
  postnew: IPost = {
    id: '',
    title: '',
    images: '',
    audio: '',
    description: '',
    categories_id: '',
    customers_id: ''
  };
  constructor(
    private localStorageService: LocalStorageService,
    private dialog: DialogService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private categoriesService: CategoriesService,) {
    this.fileExtensionAudio = '',
    this.newFileName = '',
    this.fileExtensionImg = ' '
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
    })
    // console.log(newPost);
  }
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
      console.error('Chưa thêm file nào');
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

    // Di chuyển khai báo fileExtensionAudio và fileExtensionImg ra khỏi hàm upload
    this.fileExtensionAudio = this.fileAudio.name.split('.').pop();
    this.fileExtensionImg = this.fileImg.name.split('.').pop();
    console.log(this.fileExtensionImg);

    const currentDate = new Date();
    this.newFileName = `${currentDate.toISOString().trim()}`;
    const pathAudio = `audio/${this.newFileName}.${this.fileExtensionAudio}`;
    const pathImg = `upload/${this.newFileName}.${this.fileExtensionImg}`;
    console.log(this.newFileName);

    Promise.all([
      uploadFile(this.fileAudio, pathAudio, (progress) => this.uploadProgressAudio = progress),
      uploadFile(this.fileImg, pathImg, (progress) => this.uploadProgressImage = progress)
    ]).then(() => {
      this.dialog.success('Đã thêm thành công!');
      this.isUploading = false;
    }).catch(error => {
      console.error('Upload failed:', error);
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

      this.postService.createPost(this.postnew).subscribe({
        next: (post: IPost) => {
          this.post.push(post);

          this.postForm.reset();
        },
        error: error => {
          console.error('Error creating post', error);
        }
      });

      // Sử dụng this.fileExtensionImg và this.fileExtensionAudio để lấy tên file

    } catch (error) {
      console.error('Error uploading image', error);
    }
  }

  getCate() {
    this.categoriesService.getCategories().subscribe(res => {
      this.categories = res.data
      // console.log(res.data);
    }, error => {
      console.log(error);

    })
  }




}