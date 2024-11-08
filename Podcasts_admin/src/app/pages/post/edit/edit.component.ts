import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPost } from 'app/@core/interfaces/post.interface';
import { ICategories } from 'app/@core/interfaces/categories.interface';
import { PostService } from 'app/@core/services/apis/post.service';
import { CategoriesService } from 'app/@core/services/apis/categories.service';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { SpinnerService } from "../../../@theme/components/spinner/spinner.service";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LocalStorageService } from "../../../@core/services/common/local-storage.service";
import { LOCALSTORAGE_KEY } from "../../../@core/config";
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  file: File | null = null;
  postForm!: FormGroup;
  fileAudio: File | null = null;
  fileImg: File | null = null;
  newFileName: string = '';
  isUploading: boolean = false;
  uploadProgressAudio: number = 0;
  uploadProgressImage: number = 0;
  private fileExtensionImg: string;
  private fileExtensionAudio: string;
  postId: string;
  categories: ICategories[] = [];
  editingCategory: ICategories = { id: '', name: '' };
  post: IPost[] = [];
  postnew: IPost = {
    id: '',
    title: '',
    description: '',
    audio: '',
    images: '',
    categories_id: '',
    customers_id: ''
  };

  constructor(
    private localStorageService: LocalStorageService,
    private dialog: DialogService,
    private spinner: SpinnerService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private categoriesService: CategoriesService,

  ) {
    this.fileExtensionAudio = '',
      this.newFileName = '',
      this.fileExtensionImg = ' '
  }

  ngOnInit(): void {
    this.getCate();
    this.getIdCate();
    this.postForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(8)]),
      description: new FormControl(''),
      categories_id: new FormControl('', [Validators.required]),
      images: new FormControl(''),
      audio: new FormControl(''),
      customers_id: new FormControl(''),
    })
  }
  // list cate
  getCate()  {
    this.spinner.show();
    this.categoriesService.getCategories().subscribe(res => {
      this.categories = res.data
      console.log(this.categories);
      this.spinner.hide();
    }, error => {
      console.log(error);

    })
  }
  // get id post and cate 
   getIdCate() {
    let id = this.route.snapshot.params['id'];
    this.spinner.show();
    this.postService.getPostById(id).subscribe({
      next: (response: { data: IPost[] }) => {
        this.postnew = response.data[0];
        console.log(this.postnew);
        const categoryId = this.postnew.categories_id;
        this.categoriesService.edit(categoryId).subscribe({
          next: (category: { data: ICategories[] }) => {
            this.editingCategory = category.data[0];
            console.log(this.editingCategory);
            this.spinner.hide();
          },
          error: error => {
            console.error('Error fetching editing category', error);
          }
        });
      },
      error: error => {
        console.error('Error fetching post', error);
      }
    });
  }


  // Đã xử lý bấc đồng bộ load được dữ liệu cate mà bị lỗi cái khác
  // async ngOnInit(): Promise<void> {
  //   await this.loadData();
  //   this.initializeForm();
  // }

  // async loadData(): Promise<void> {
  //   try {
  //     await this.getCate();
  //     await this.getIdCate();
  //   } catch (error) {
  //     console.error('Error loading data', error);
  //   }
  // }

  // async getCate(): Promise<void> {
  //   try {
  //     const res = await this.categoriesService.getCategories().toPromise();
  //     this.categories = res.data;
  //     console.log(this.categories);
  //   } catch (error) {
  //     console.log('Error fetching categories', error);
  //   }
  // }

  // async getIdCate(): Promise<void> {
  //   try {
  //     let id = this.route.snapshot.params['id'];
  //     const response = await this.postService.getPostById(id).toPromise();
  //     this.postnew = response.data[0];
  //     console.log(this.postnew);
  //     const categoryId = this.postnew.categories_id;
  //     const category = await this.categoriesService.edit(categoryId).toPromise();
  //     this.editingCategory = category.data[0];
  //     console.log(this.editingCategory);
  //   } catch (error) {
  //     console.error('Error fetching post or editing category', error);
  //   }
  // }


  // initializeForm(): void {
  //     this.postForm = new FormGroup({
  //       title: new FormControl('', [Validators.required, Validators.minLength(8)]),
  //       description: new FormControl(''),
  //       categories_id: new FormControl('', [Validators.required]),
  //       images: new FormControl(''),
  //       audio: new FormControl(''),
  //       customers_id: new FormControl(''),
  //     })
  //   }











  
  onFileChange(event: any, fileType: string): void {
    const file = event.target.files[0];
    if (fileType === 'audio') {
      this.fileAudio = file;
    } else if (fileType === 'image') {
      this.fileImg = file;
    }
  }

  async upload(): Promise<void> {
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

    // Di chuyển khai báo fileExtensionAudio và fileExtensionImg ra khỏi hàm upload
    this.fileExtensionAudio = this.fileAudio.name.split('.').pop();
    this.fileExtensionImg = this.fileImg.name.split('.').pop();
    // console.log(this.fileExtensionImg);

    const currentDate = new Date();
    this.newFileName = `${currentDate.toISOString().trim()}`;
    const pathAudio = `audio/${this.newFileName}.${this.fileExtensionAudio}`;
    const pathImg = `upload/${this.newFileName}.${this.fileExtensionImg}`;

    console.log(this.newFileName);
    await this.storage.upload(pathAudio, this.fileAudio);
    await this.storage.upload(pathImg, this.fileImg);
    console.log('Cập nhật thành công, new file name:', this.newFileName);
    Promise.all([
      uploadFile(this.fileAudio, pathAudio, (progress) => this.uploadProgressAudio = progress),
      uploadFile(this.fileImg, pathImg, (progress) => this.uploadProgressImage = progress)
    ]).then(() => {
      // this.dialog.success('Đã thêm thành công!');
      this.isUploading = false;
    }).catch(error => {
      console.error('Upload failed:', error);
      this.isUploading = false;
    });
  }

  async onUpdate(): Promise<void> {
    const customerIdRaw = this.localStorageService.getItem(LOCALSTORAGE_KEY.userInfo);
    const customerId = customerIdRaw[0].id;

    if (this.postForm.invalid) {
      return;
    }

    try {
      if (this.fileImg || this.fileAudio) {
        await this.upload();
        this.postnew.images = `${this.newFileName}.${this.fileExtensionImg}`;
        this.postnew.audio = `${this.newFileName}.${this.fileExtensionAudio}`;
      }
      this.postnew.customers_id = customerId;
      const postId = this.route.snapshot.params['id'];
      this.postnew.id = postId;

      this.postService.updatePost(this.postnew, postId).subscribe({
        next: () => {
          this.dialog.success('Đã thêm thành công!');
        },
        error: error => {
          console.error('Error updating post', error);
        }
      });

    } catch (error) {
      console.error('Error uploading image', error);
    }
  }


}