import React, { useState, useEffect } from "react";
import "./CommentBox.css";

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
  customer,
  commentToEdit,
  setCommentToEdit,
  onSubmit,
}) => {
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newCommentData = {
        id: editingCommentId, // Add id if editing
        post_id: postId,
        customers_id: customer?.id,
        contents: comment,
        rating: rating,
      };
      onSubmit(newCommentData); // Call parent component's onSubmit function

      // Reset form data if adding a new comment (not editing)
      if (!editingCommentId) {
        setComment("");
        setRating(5);
      }

      // Reset edit state after successful edit
      setCommentToEdit(null);
    } else {
      console.log("Vui lòng nhập nội dung bình luận!");
    }
  };

  return (
    <>
      <div className="custom-timeline-comment-box mt-auto rounded">
        <div className="d-flex mb-3">
          <div className="user">
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${customer?.images}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
              alt="user-avatar"
            />
          </div>
          <div>
            <strong className="mx-2">{customer?.username}</strong>
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
                  setCommentToEdit(null); // Clear commentToEdit
                }}
              >
                Hủy
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CommentBox;
