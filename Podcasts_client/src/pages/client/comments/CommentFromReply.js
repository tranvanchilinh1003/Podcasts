// components/comments/ReplyForm.js

import React from 'react';

const ReplyForm = ({ replyToEdit, onSubmit, replyContent, setReplyContent, usersImage }) => {
  return (
      <div className="custom-timeline-comment-box bg-reply mt-auto rounded">
          <div className="user">
              <img
                  src={usersImage ? `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${usersImage}?alt=media` : 'default-avatar.png'}
                  alt="user-avatar"
              />
          </div>

          <div className="custom-comment-input-container">
              <form onSubmit={onSubmit}>
                  <div className="input-group ml-2 mt-2">
                      <input
                          type="text"
                          name="contents" // Đảm bảo input có name để lấy giá trị trong handleSubmit
                          className="custom-comment-input rounded-5"
                          placeholder={replyToEdit ? "Chỉnh sửa bình luận..." : "Viết một bình luận..."}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className="custom-icon-container">
                          <div className="custom-icon" onClick={onSubmit}>
                              <i className="fa fa-paper-plane"></i>
                              <div className="custom-overlay"></div>
                          </div>
                      </div>
                  </div>
              </form>
          </div>
      </div>
  );
};

export default ReplyForm;
