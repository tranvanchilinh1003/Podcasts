import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-list-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  socket: any;
  comments: any[] = []; // Danh sách bình luận gốc
  postId: number | null = null; // ID bài viết sẽ được lấy từ route param
  currentPage: number = 1; // Trang hiện tại, sẽ dùng để tính số lượng bình luận đã tải
  limit: number = 10; // Số lượng bình luận mỗi lần tải
  totalComments: number = 0; // Tổng số bình luận (được cập nhật từ server)
  hasMoreComments: boolean = false; // Biến kiểm tra xem còn bình luận nào cần tải không

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const postIdParam = params.get('id');
      if (postIdParam) {
        this.postId = +postIdParam;
        this.initSocket();
        this.getParentComments(); // Lấy danh sách bình luận ban đầu
      } else {
        console.error('Không tìm thấy postId trong route parameters!');
      }
    });
  }

  // Kết nối với Socket.IO server
  initSocket() {
    this.socket = io('http://localhost:8080'); // Thay bằng URL server của bạn
    this.initSocketListeners();
  }

  // Lắng nghe sự kiện từ server
  initSocketListeners() {
    this.socket.on('Parent_comments', (data: any) => {
      console.log(data);
      // Cập nhật danh sách bình luận và tổng số bình luận
      if (data.comments && data.comments.length) {
        // Dồn bình luận vào danh sách hiện tại (cộng dồn, không thay thế)
        this.comments = [...this.comments, ...data.comments];
        this.totalComments = data.totalComments; // Tổng số bình luận
        this.hasMoreComments = this.comments.length < this.totalComments; // Kiểm tra xem còn bình luận để tải không
      }
    });

    this.socket.on('Child_comments', (data: any) => {
      const parentComment = this.comments.find((c) => c.id === data.parentId);
      if (parentComment) {
        parentComment.replies = data.childComments;
      }
    });

    this.socket.on('Error', (error: any) => {
      console.error('Error from server:', error);
    });
  }

  // Gửi yêu cầu lấy danh sách bình luận gốc
  getParentComments() {
    if (this.postId) {
      this.socket.emit('Get_comments', {
        postId: this.postId,
        page: this.currentPage,
        limit: this.limit,
      });
    }
  }

  // Gửi yêu cầu lấy danh sách trả lời cho một bình luận gốc
  getReplies(parentId: number) {
    this.socket.emit('Get_child_comments', {
      parentId,
      replyPage: 1,
      replyLimit: 10,
    });
  }

  // Toggle hiển thị trả lời cho một bình luận
  toggleReplies(comment: any) {
    comment.isRepliesVisible = !comment.isRepliesVisible;
    if (comment.isRepliesVisible && !comment.replies) {
      // Nếu chưa có bình luận trả lời, gọi API để lấy
      this.getReplies(comment.id);
    }
  }

  // Nút xem thêm bình luận
  loadMoreComments() {
    this.currentPage++;
    this.getParentComments(); // Tải thêm bình luận
  }

  // Tạo URL Firebase
  getFirebaseImageURL(imageName: string): string {
    return imageName
      ? `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${imageName}?alt=media&token=c6dc72e8-a1b0-41bb-b1f5-84f63f7397e9`
      : 'https://via.placeholder.com/40'; // URL mặc định nếu không có hình ảnh
  }
}
