import React, { useState, useMemo } from "react";
import "./CommentItem.css";
import { Modal } from "antd";
import getSocket from "../../../config/socket";
import ReplyForm from "./ReplyForm";

const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill={filled ? "gold" : "lightgray"}
  >
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
  </svg>
);

const Rating = ({ value }) => {
  const maxRating = 5;
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(<Star key={i} filled={i <= value} />);
  }
  return <div className="d-flex mt-1 none">{stars}</div>;
};

const CommentItem = React.memo(
  ({
    comment = {},
    replies,
    onEdit,
    onDelete,
    userId,
    customer,
    totalReplies,
    isReply = false,
    onLoadMoreReplies,
    onHideReplies,
    repliesLimit,
    visibleReplies,
    rootParentId = null,
  }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [editingReply, setEditingReply] = useState(null);

    // Lấy ID của bình luận cha gốc (để đảm bảo chỉ phân cấp 2 tầng)
    const parentIdToUse = rootParentId || comment.id;

    // Hàm useMemo để quản lý danh sách các phản hồi hiển thị
    const displayedReplies = useMemo(() => {
      return replies.slice(0, visibleReplies || 0);
    }, [replies, visibleReplies]);

    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };

    const handleEdit = (comment) => {
      setDropdownOpen(false);
      if (isReply) {
        setEditingReply(comment);
        setReplyContent(comment.contents);
      } else {
        onEdit(comment);
      }
    };

    const showDeleteModal = () => {
      setDropdownOpen(false);
      setIsModalVisible(true);
    };

    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const handleReplyClick = () => {
      setIsReplying((prev) => !prev);
    };

    const handleReplySubmit = (e) => {
      e.preventDefault();
      if (replyContent.trim() === "") return;

      const socketInstance = getSocket();
      if (editingReply) {
        socketInstance.emit("Edit_comment", {
          id: editingReply.id,
          post_id: comment.post_id,
          customers_id: userId,
          contents: replyContent,
          rating: null,
        });
        setEditingReply(null);
      } else {
        socketInstance.emit("Send_message", {
          parent_id: parentIdToUse, // Sử dụng ID của bình luận cha gốc
          post_id: comment.post_id,
          customers_id: userId,
          contents: replyContent,
          rating: null,
        });
      }

      setReplyContent("");
      setIsReplying(false);
    };

    return (
      <div className="comment-item rounded p-3">
        <div className="d-flex" key={comment.id}>
          <img
            src={
              comment.images
                ? `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${comment.images}?alt=media`
                : "default-avatar.png"
            }
            alt={comment.username || "Anonymous"}
            className="comment-item-pic rounded-5"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <div className="bg_Contens ml-3 pt-2 px-3 rounded-4">
            <strong>{comment.username || "Anonymous"}</strong>
            <span className="ml-2 text-muted">
              {comment.date ? new Date(comment.date).toLocaleDateString() : ""}
            </span>
            {!isReply && <Rating value={comment.rating || 0} />}
            <p className="m">{comment.contents || ""}</p>
          </div>
          {userId && (
            <div className="position-relative ml-2">
              <button
                onClick={toggleDropdown}
                className="mt-4 ml-2 btn btn-link"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="bi bi-three-dots"
                  style={{ fontSize: "24px", color: "black" }}
                ></i>
              </button>
              {dropdownOpen && (
                <div
                  className="dropdown-menu dropdown-menu-left show position-absolute"
                  style={{ top: "65%" }}
                >
                  {comment.customers_id === userId ? (
                    <>
                      <button
                        onClick={() => handleEdit(comment)}
                        className="dropdown-item"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={showDeleteModal}
                        className="dropdown-item"
                      >
                        Xóa
                      </button>
                    </>
                  ) : (
                    <button className="dropdown-item">Báo cáo</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {userId && (
          <div className="comment-options d-flex justify-content-start mt-2 ml-5">
            <p
              onClick={handleReplyClick}
              className="btn-link mx-3"
              style={{ fontSize: "14px", color: "black", cursor: "pointer" }}
            >
              Trả lời
            </p>
          </div>
        )}

        {isReplying && (
          <ReplyForm
            replyToEdit={editingReply}
            onSubmit={handleReplySubmit}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            usersImage={customer.images}
          />
        )}

        {userId && totalReplies > 0 && (
          <div className="ml-3">
            {visibleReplies === 0 ? (
              <strong
                onClick={() => onLoadMoreReplies(comment.id, 1, repliesLimit)}
                className="ml-5 custom-cursor"
                style={{
                  fontSize: "16px",
                  color: "#65676B",
                  cursor: "pointer",
                }}
              >
                Xem tất cả {totalReplies} phản hồi
              </strong>
            ) : (
              <div>
                {displayedReplies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    replies={replies[reply.id] || []}
                    rootParentId={parentIdToUse} // Truyền ID cha gốc xuống
                    onEdit={onEdit}
                    onDelete={onDelete}
                    userId={userId}
                    customer={customer}
                    isReply={true}
                    onLoadMoreReplies={onLoadMoreReplies}
                    totalReplies={reply.totalReplies}
                    repliesLimit={repliesLimit}
                    visibleReplies={visibleReplies[reply.id] || 0}
                    onHideReplies={onHideReplies}
                  />
                ))}

                <div className="mt-2 ml-2">
                  {visibleReplies < totalReplies ? (
                    <strong
                      onClick={() =>
                        onLoadMoreReplies(
                          comment.id,
                          Math.ceil(visibleReplies / repliesLimit) + 1,
                          repliesLimit
                        )
                      }
                      className="ml-3 custom-cursor"
                      style={{
                        fontSize: "16px",
                        color: "#65676B",
                        cursor: "pointer",
                      }}
                    >
                      Xem phản hồi khác
                      <i className="bi bi-chevron-compact-down"></i>
                    </strong>
                  ) : (
                    visibleReplies > 0 && (
                      <strong
                        onClick={() => onHideReplies(comment.id)}
                        className="ml-3 custom-cursor"
                        style={{
                          fontSize: "16px",
                          color: "#65676B",
                          cursor: "pointer",
                        }}
                      >
                        Ẩn bớt <i className="bi bi-chevron-compact-up pl-1"></i>
                      </strong>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <Modal
          title="Xác nhận xóa"
          visible={isModalVisible}
          onOk={() => {
            onDelete(comment.id);
            setIsModalVisible(false);
          }}
          onCancel={handleCancel}
          okText="Xóa"
          okType="danger"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn xóa bình luận này không?</p>
        </Modal>
      </div>
    );
  }
);

export default CommentItem;
