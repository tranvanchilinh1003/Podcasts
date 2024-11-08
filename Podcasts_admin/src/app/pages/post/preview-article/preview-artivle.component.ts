import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPost } from 'app/@core/interfaces/post.interface';
import { ICategories } from 'app/@core/interfaces/categories.interface';
import { PostService } from 'app/@core/services/apis/post.service';
import { CategoriesService } from 'app/@core/services/apis/categories.service';
import { DialogService } from 'app/@core/services/common/dialog.service';
import { SpinnerService } from "../../../@theme/components/spinner/spinner.service";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LocalStorageService } from "../../../@core/services/common/local-storage.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-preview-article',
  templateUrl: './preview-article.component.html',
  styleUrls: ['./preview-article.component.scss']
})
export class PreviewComponent implements OnInit {
  
  isExpanded = false;
  truncatedDescription: string;
  postForm!: FormGroup;
  postnew: IPost = {
    id: '',
    title: '',
    description: '',
    audio: '',
    images: '',
    categories_id: '',
    customers_id: ''
  };
  categories: ICategories[] = [];
  editingCategory: ICategories = { id: '', name: '' };

  constructor(
    private localStorageService: LocalStorageService,
    private dialog: DialogService,
    private spinner: SpinnerService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private categoriesService: CategoriesService,
  ) {}

  ngOnInit(): void {
    this.getCate();
    this.getIdCate();
    this.initializeForm();
  }

  private initializeForm() {
    this.postForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(8)]),
      description: new FormControl(''),
      categories_id: new FormControl('', [Validators.required]),
      images: new FormControl(''),
      audio: new FormControl(''),
      customers_id: new FormControl(''),
    });
  }

  // Fetch categories
  getCate() {
    this.spinner.show();
    this.categoriesService.getCategories().subscribe(res => {
      this.categories = res.data;
      this.spinner.hide();
    }, error => {
      console.error(error);
      this.spinner.hide();
    });
  }

  // Fetch post and category
  getIdCate() {
    const id = this.route.snapshot.params['id'];
    this.spinner.show();
    this.postService.getPostById(id).subscribe({
      next: (response: { data: IPost[] }) => {
        this.postnew = response.data[0];
        this.truncatedDescription = this.truncateTextWithHtml(this.postnew.description, 100);
        this.getEditingCategory(this.postnew.categories_id);
        this.spinner.hide();
      },
      error: error => {
        console.error('Error fetching post', error);
        this.spinner.hide();
      }
    });
  }

  private getEditingCategory(categoryId: string) {
    this.categoriesService.edit(categoryId).subscribe({
      next: (category: { data: ICategories[] }) => {
        this.editingCategory = category.data[0];
      },
      error: error => {
        console.error('Error fetching editing category', error);
      }
    });
  }

  private truncateTextWithHtml(html: string, maxLength: number): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    const text = tempElement.innerText || tempElement.textContent;
    if (text.length <= maxLength) return html;

    let truncatedText = text.substr(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');

    if (lastSpaceIndex > 0) {
      truncatedText = truncatedText.substr(0, lastSpaceIndex);
    }

    const truncatedHtml = tempElement.innerHTML.substr(0, truncatedText.length);
    return truncatedHtml + '...';
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
