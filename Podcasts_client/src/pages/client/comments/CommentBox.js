import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { SocketContext } from "../../../config/SocketContext";
import "./CommentBox.css";

const API_BASE_URL = "http://localhost:8080/api";

const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill={filled ? "gold" : "lightgray"}
  >
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
  </svg>
);

const Rating = ({ value, onClick }) => {
  const maxRating = 5;
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <span key={i} onClick={() => onClick(i)} style={{ cursor: "pointer" }}>
        <Star filled={i <= value} />
      </span>
    );
  }
  return <div className="d-flex mt-1">{stars}</div>;
};

const CommentBox = ({
  postId,
  fetchComments,
  custommer,
  commentToEdit,
  setCommentToEdit,
}) => {
  const socket = useContext(SocketContext);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [editingCommentId, setEditingCommentId] = useState(null);
  

  useEffect(() => {
    if (commentToEdit) {
      setComment(commentToEdit.contents);
      setRating(commentToEdit.rating);
      setEditingCommentId(commentToEdit.id);
    } else {
      setComment("");
      setRating(5);
      setEditingCommentId(null);
    }
  }, [commentToEdit]);

  useEffect(() => {
    // Nghe sự kiện newComment từ socket
    socket.on("newComment", (data) => {
      console.log("Received new comment:", data);
      fetchComments(); // Gọi lại hàm fetchComments để cập nhật bình luận
    });

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      socket.off("newComment"); // Ngừng nghe sự kiện khi component unmount
    };
  }, [socket, fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        if (editingCommentId) {
          await axios.patch(`${API_BASE_URL}/comments/${editingCommentId}`, {
            customers_id: custommer[0].id,
            postId: parseInt(postId),
            contents: comment,
            rating: rating,
          });
        } else {
          const result = await axios.post(`${API_BASE_URL}/comments`, {
            customers_id: custommer[0].id,
            postId: parseInt(postId),
            contents: comment,
            rating: rating,
          });

          // Phát sự kiện bình luận mới
          socket.emit("newComment", {
            id: result.data.data.id, // ID bình luận mới
            postId: parseInt(postId),
            customerId: custommer[0].id,
            contents: comment,
            rating: rating,
            date: new Date(), // Thêm thời gian nếu cần
          });
        }

        setComment("");
        setRating(5);
        setEditingCommentId(null);
        setCommentToEdit(null); // Xóa commentToEdit sau khi hoàn thành
        fetchComments(); // Cập nhật lại danh sách bình luận
      } catch (error) {
        console.error("Error submitting comment:", error);
        alert("Đã có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại."); // Thông báo lỗi
      }
    }
  };

  return (
    <div className="custom-timeline-comment-box mt-auto rounded">
      <div className="d-flex mb-3">
        <div className="user">
          <img
            src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${custommer[0].images}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
            alt="user-avatar"
          />
        </div>
        <div>
          <strong className="mx-2">{custommer[0].username}</strong>
          <Rating value={rating} onClick={setRating} />
        </div>
      </div>
      <div className="custom-comment-input-container">
        <form onSubmit={handleCommentSubmit}>
          <div className="input-group ml-2 mt-2">
            <input
              type="text"
              className="custom-comment-input"
              placeholder="Viết một bình luận..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="custom-icon-container ">
              <div className="custom-icon" onClick={handleCommentSubmit}>
                <i className="fa fa-paper-plane"></i>
                <div className="custom-overlay"></div>
              </div>
            </div>
          </div>
          {editingCommentId && (
            <button
              type="button"
              className="btn btn-secondary mt-3 ml-3"
              onClick={() => {
                setEditingCommentId(null);
                setComment("");
                setRating(5);
                setCommentToEdit(null); // Thực hiện xóa commentToEdit
              }}
            >
              Hủy
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CommentBox;  