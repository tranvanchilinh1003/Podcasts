import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPost } from 'app/@core/interfaces/post.interface';
import { PostService } from 'app/@core/services/apis/post.service';
import { LocalStorageService } from "../../../@core/services/common/local-storage.service";
import { SpinnerService } from "../../../@theme/components/spinner/spinner.service";

@Component({
  selector: 'app-preview-article',
  templateUrl: './preview-article.component.html',
  styleUrls: ['./preview-article.component.scss']
})
export class PreviewComponent implements OnInit {
  postnew: IPost = {
    id: '',
    title: '',
    description: '',
    audio: '',
    images: '',
    categories_id: '',
    customers_id: '',
    isLiked: false, // Added 'isLiked' property
    total_likes: 0
  };
  isExpanded: boolean = false;
  truncatedDescription: string = '';

  constructor(
    private localStorageService: LocalStorageService,
    private postService: PostService,
    private spinner: SpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getPostById();
  }

  // Fetch post by ID
  getPostById() {
    const id = this.route.snapshot.params['id'];
    this.spinner.show();
    this.postService.getPostById(id).subscribe({
      next: (response: { data: IPost[] }) => {
        if (response.data && response.data.length > 0) {
          this.postnew = response.data[0];
          this.truncatedDescription = this.truncateTextWithHtml(this.postnew.description, 100);
          this.checkIfLiked(); // Check if the current user has liked this post
        }
        this.spinner.hide();
      },
      error: error => {
        console.error('Error fetching post', error);
        this.spinner.hide();
      }
    });
  }

  checkIfLiked() {
    const customer = this.localStorageService.getItem('userInfo');
    if (customer) {
      const userId = customer[0].id;  
      const id = this.route.snapshot.params['id']; 
  
      this.postService.checkLikes(userId, id).subscribe({
        next: (response: Array<{ post_id: number }>) => {  
        
          const likedPost = response.find(post => post.post_id === +id);
          this.postnew.isLiked = likedPost ? true : false;  
        },
        error: (error) => {
          console.error('Error checking like status', error);
        }
      });
    }
  }
  
  

  // Toggle like status (like/unlike)
  handleLikeClick(postId: string): void {
    const customer = this.localStorageService.getItem('userInfo');

  
    const userId = customer[0].id;
    const isLiked = this.postnew.isLiked;
    this.postnew.isLiked = !isLiked;
    this.postnew.total_likes = isLiked ? this.postnew.total_likes - 1 : this.postnew.total_likes + 1;
    if (this.postnew.isLiked) {
      this.postService.addLike(postId, userId).subscribe({
        next: () => {
          this.getPostById()
        },
        error: (error) => {
          console.error('Error liking post', error);
          this.postnew.isLiked = isLiked; 
          this.postnew.total_likes = isLiked ? this.postnew.total_likes + 1 : this.postnew.total_likes - 1; 
        }
      });
    } else {
      this.postService.removeLike(postId, userId).subscribe({
        next: () => {
          console.log('Post unliked successfully');
        },
        error: (error) => {
          console.error('Error unliking post', error);
          this.postnew.isLiked = isLiked; 
          this.postnew.total_likes = isLiked ? this.postnew.total_likes + 1 : this.postnew.total_likes - 1; 
        }
      });
    }
  }

  // Toggle expanded description
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  // Truncate text to a specified length and add ellipsis
  truncateTextWithHtml(text: string, length: number): string {
    if (!text) return '';
    const truncated = text.length > length ? text.substring(0, length) + '...' : text;
    return truncated;
  }

  // Placeholder for comment submit handler
  handleCommentSubmit() {
    console.log('Bình luận đã được gửi!');
    // Implement comment submission logic here
  }

  onTimeUpdate(audioPlayer: HTMLAudioElement): void {
    const duration = audioPlayer.duration;  // Total duration of the audio
    const currentTime = audioPlayer.currentTime;  // Current time the user has listened to

    // Check if the user has listened to 80% of the audio
    if (currentTime / duration >= 0.8) {
      this.updateViewCount();
    }
  }


  updateViewCount() {
    this.postService.updateView(this.postnew.id).subscribe({
      next: () => {
        this.getPostById();
      },
      error: (error) => {
        console.error('Error updating view count', error);
      }
    });
  }
}
