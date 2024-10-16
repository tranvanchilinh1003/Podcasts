import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./CommentItem.css";

import { DialogService } from "../../../services/common/DialogService";
import ReplyForm from "./CommentFromReply";

const API_BASE_URL = "http://localhost:8080/api";

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

const CommentItem = (props) => {
  const {
    comment = {},
    onEdit,
    userId,
    fetchPost,
    fetchComments,
    ...rest
  } = props;

  const [totalComment, settotalComment] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState([]);
  const [replyFormVisibleFor, setReplyFormVisibleFor] = useState(null);
  const [replyDropdownOpen, setReplyDropdownOpen] = useState({});
  const [replyToEdit, setReplyToEdit] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");
  const [visibleReplies, setVisibleReplies] = useState(0);
  const [visibleChildReplies, setVisibleChildReplies] = useState(0);
  const [usersImage, setUserImage] = useState(null);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(API_BASE_URL);

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.connected);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current.on("newReply", (data) => {
      if (data.commentId === comment.id) {
        setReplies((prevReplies) =>
          organizeReplies([...prevReplies, data.replyData])
        );
      }
    });

    socketRef.current.on("deleteReply", (data) => {
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply.id !== data.id)
      );
    });

    socketRef.current.on("editReply", (data) => {
      setReplies((prevReplies) => {
        return prevReplies.map((reply) => {
          if (reply.id === data.id) {
            return { ...reply, contents: data.contents };
          }
          return reply;
        });
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [comment.id]);

  const organizeReplies = (replies) => {
    const map = {};
    const result = [];

    replies.forEach((reply) => {
      map[reply.id] = { ...reply, replies: [] };
    });

    replies.forEach((reply) => {
      if (reply.parent_reply_id) {
        const parent = map[reply.parent_reply_id];
        if (parent) {
          parent.replies.push(map[reply.id]);
        }
      } else {
        result.push(map[reply.id]);
      }
    });

    return result;
  };

  useEffect(() => {
    // Lấy URL hình ảnh từ localStorage
    const imageUrl = JSON.parse(localStorage.getItem("customer"));
    if (imageUrl) {
      setUserImage(imageUrl[0].images);
    }
  }, []);

  const fetchReplies = async () => {
    if (comment.id) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/repcomments/${comment.id}`
        );
        const organizedReplies = organizeReplies(response.data.data || []);
        const totalComment = response.data.data;
        settotalComment(totalComment.length);
        setReplies(organizedReplies);
      } catch (error) {
        console.error("Error fetching replies:", error);
        alert("Có lỗi xảy ra khi tải phản hồi. Vui lòng thử lại.");
      }
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [comment.id]);

  const handleEdit = () => {
    setDropdownOpen(false);
    onEdit(comment);
  };

  const handleReplySubmit = async (e, parentId = null) => {
    if (e) e.preventDefault();

    if (replyContent) {
      try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${(
          currentDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")} ${currentDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${currentDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${currentDate
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;

        const newReply = {
          contents: replyContent,
          date: formattedDate,
          customers_id: userId,
          original_comment_id: comment.id,
          parent_reply_id: parentId,
        };

        const response = await axios.post(
          `${API_BASE_URL}/repcomments`,
          newReply
        );
        console.log("Reply created:", response.data);

        setReplyContent("");
        setReplyFormVisibleFor(null);
        fetchReplies(); // Làm mới danh sách phản hồi
      } catch (error) {
        console.error("Error creating reply:", error);
        alert("Có lỗi xảy ra khi tạo phản hồi. Vui lòng thử lại.");
      }
    }
  };

  const handleReplyToReply = (replyId) => {
    setReplyFormVisibleFor(replyId); // Set the reply we're responding to
  };

  const toggleReplyForm = () => {
    setReplyFormVisibleFor(
      replyFormVisibleFor === comment.id ? null : comment.id
    ); // Toggle form visibility
  };

  const toggleReplyDropdown = (replyId) => {
    setReplyDropdownOpen((prev) => ({ ...prev, [replyId]: !prev[replyId] }));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle main comment dropdown visibility
  };

  const handleEditReply = async () => {
    if (replyToEdit && editedReplyContent) {
      try {
        await axios.patch(`${API_BASE_URL}/repcomments/${replyToEdit.id}`, {
          contents: editedReplyContent,
        });
  
        await fetchReplies(); // Refresh replies
        await fetchPost();
        setReplyToEdit(null);
        setEditedReplyContent("");
      } catch (error) {
        if (error.response) {
          // Server responded với một mã trạng thái ngoài phạm vi 2xx
          console.error("Error updating reply:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          // Yêu cầu đã được gửi nhưng không nhận được phản hồi
          console.error("Error updating reply: No response received", error.request);
        } else {
          // Một lỗi xảy ra khi thiết lập yêu cầu
          console.error("Error updating reply:", error.message);
        }
        alert("Có lỗi xảy ra khi cập nhật phản hồi. Vui lòng thử lại.");
      }
    }
  };
  

  const handleDeleteComment = async (commentId) => {
    try {
      const confirmed = await DialogService.showConfirmationDialog(
        "comments",
        commentId
      );
      if (confirmed) {
        await fetchComments(comment.post_id); // Refresh comments after deletion
      }
    } catch (error) {
      console.error("Error handling delete comment:", error);
      alert("Có lỗi xảy ra khi xử lý yêu cầu xóa bình luận. Vui lòng thử lại.");
    }
  };

  const handleDeleteReply = async (replyId) => {
    const confirmed = await DialogService.showConfirmationDialog(
      "repcomments",
      replyId
    );
    if (confirmed) {
      await fetchReplies(); // Làm mới phản hồi sau khi xóa
      await fetchPost();
    }
  };

  const loadMore = () => {
    setVisibleReplies(5); // Show the first 5 replies initially
  };

  const loadMoreReplies = () => {
    const remainingReplies = replies.length - visibleReplies;
    const repliesToShow = Math.min(remainingReplies, 5); // Hiển thị tối đa 5 reply mỗi lần
    setVisibleReplies(visibleReplies + repliesToShow);
  };

  const hideReplies = () => {
    setVisibleReplies(0); // Ẩn tất cả phản hồi
  };

  const showMoreReplies = (replyId, level) => {
    setVisibleChildReplies((prevState) => ({
      ...prevState,
      [`${replyId}-${level}`]: (prevState[`${replyId}-${level}`] || 0) + 5, // Tăng thêm 5 reply cho mỗi lần nhấn "Xem thêm"
    }));
  };

  const renderReplies = (replies, level = 1) => {
    return (
      <div>
        {replies.map((reply) => {
          // Tạo một key duy nhất cho mỗi reply dựa trên id và cấp độ
          const replyKey = `${reply.id}-${level}`;
          const visibleCount = visibleChildReplies[replyKey] || 0; // Mặc định hiển thị 0 reply con đầu tiên

          // Chỉ lấy số lượng reply con dựa trên visibleCount cho reply cụ thể
          const childReplies =
            reply.replies && reply.replies.length > 0
              ? renderReplies(reply.replies.slice(0, visibleCount), level + 1)
              : null;

          return (
            <div
              key={reply.id}
              className={`reply-container rounded mb-2 ${
                level > 1 ? "reply-nested" : ""
              } ${level > 2 ? "pl-0" : "pl-4"}`}
            >
              <div className="d-flex mb-2">
                <img
                  src={
                    reply.images
                      ? `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${reply.images}?alt=media`
                      : "default-avatar.png"
                  }
                  alt={reply.username || "Anonymous"}
                  className="comment-item-pic rounded-5"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div className="bg_Contens ml-3 pt-2 px-3 rounded-4">
                  <strong>{reply.username || "Anonymous"}</strong>
                  <span className="ml-2 text-muted">
                    {reply.date
                      ? new Date(reply.date).toLocaleDateString()
                      : ""}
                  </span>
                  <p>{reply.contents || ""}</p>
                </div>
                <div className="position-relative">
                  <button
                    onClick={() => toggleReplyDropdown(reply.id)}
                    className="mt-3 ml-2 btn btn-link"
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
                  {replyDropdownOpen[reply.id] && (
                    <div
                      className="dropdown-menu dropdown-menu-left show position-absolute"
                      style={{ top: "65%" }}
                    >
                      {reply.customers_id === userId ? (
                        <>
                          <button
                            onClick={() => {
                              setReplyToEdit(reply);
                              setEditedReplyContent(reply.contents);
                              setReplyDropdownOpen(false);
                            }}
                            className="dropdown-item"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
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
              </div>

              <div className="reply-options d-flex justify-content-start mt-2 ml-5">
                <p
                  className="btn-link mx-3"
                  onClick={() => handleReplyToReply(reply.id)}
                  style={{ fontSize: "14px", color: "black" }}
                >
                  Trả lời
                </p>
              </div>

              {/* Tích hợp ReplyForm */}
              {(replyFormVisibleFor === reply.id ||
                (replyToEdit && replyToEdit.id === reply.id)) && (
                <ReplyForm
                  replyToEdit={
                    replyToEdit && replyToEdit.id === reply.id
                      ? replyToEdit
                      : null
                  }
                  replyContent={
                    replyToEdit && replyToEdit.id === reply.id
                      ? editedReplyContent
                      : replyContent
                  }
                  setReplyContent={
                    replyToEdit && replyToEdit.id === reply.id
                      ? setEditedReplyContent
                      : setReplyContent
                  }
                  onSubmit={
                    replyToEdit && replyToEdit.id === reply.id
                      ? handleEditReply
                      : (e) => handleReplySubmit(e, reply.id)
                  }
                  usersImage={usersImage}
                />
              )}

              {/* Render child replies */}
              {childReplies}

              {/* Nút "Xem thêm" và "Ẩn bớt" */}
              {(reply.replies?.length || 0) > 0 && (
                <div className="d-flex justify-content-start mb-3">
                  {visibleCount < (reply.replies?.length || 0) && (
                    <strong
                      className="btn-link"
                      style={{
                        fontSize: "16px",
                        color: "#65696B",
                        textDecoration: "none",
                        fontWeight: "500",
                        cursor: "pointer",
                        marginLeft: "60px",
                      }}
                      onClick={() => showMoreReplies(reply.id, level)}
                    >
                      Xem thêm <i className="bi bi-chevron-compact-down"></i>
                    </strong>
                  )}
                  {/* {visibleCount > 0 && level > 0 && (
                                        <strong
                                            className="btn-link ml-auto custom-cursor"
                                            onClick={() => setVisibleChildReplies((prevState) => ({
                                                ...prevState,
                                                [replyKey]: 0
                                            }))}>
                                            Ẩn bớt <i className="bi bi-chevron-compact-up"></i>
                                        </strong>
                                    )} */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="comment-item rounded p-3">
      <div className="d-flex">
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
          <Rating value={comment.rating || 0} />
          <p className="m">{comment.contents || ""}</p>
        </div>
        {userId && ( // Kiểm tra nếu userId tồn tại
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
                      onClick={() => {
                        handleEdit(comment);
                      }}
                      className="dropdown-item"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
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
      {userId && ( // Kiểm tra nếu userId tồn tại
        <div className="comment-options d-flex justify-content-start mt-2 ml-5">
          <p
            className="btn-link mx-3"
            onClick={toggleReplyForm}
            style={{ fontSize: "14px", color: "black" }}
          >
            Trả lời
          </p>
        </div>
      )}
      {(replyFormVisibleFor === comment.id ||
        (replyToEdit && replyToEdit.id === comment.id)) && (
        <ReplyForm
          replyToEdit={
            replyToEdit && replyToEdit.id === comment.id ? replyToEdit : null
          }
          replyContent={
            replyToEdit && replyToEdit.id === comment.id
              ? editedReplyContent
              : replyContent
          }
          setReplyContent={
            replyToEdit && replyToEdit.id === comment.id
              ? setEditedReplyContent
              : setReplyContent
          }
          onSubmit={
            replyToEdit && replyToEdit.id === comment.id
              ? handleEditReply
              : (e) => handleReplySubmit(e, null) // Thay đổi từ comment.id thành null
          }
          usersImage={usersImage}
        />
      )}
      {userId ? (
        <>
          {replies.length > 0 && (
            <>
              {visibleReplies === 0 ? (
                <div className="mt-2 ml-3">
                  <strong
                    onClick={loadMore}
                    className="ml-5"
                    style={{
                      fontSize: "16px",
                      color: "#65676B",
                      cursor: "pointer",
                    }}
                  >
                    Xem tất cả {totalComment} phản hồi
                  </strong>
                </div>
              ) : (
                <div>
                  {renderReplies(replies.slice(0, visibleReplies))}{" "}
                  {/* Hiển thị phản hồi dựa trên visibleReplies */}
                  <div className="replies-buttons-container mt-2 ml-5">
                    {visibleReplies < replies.length ? ( // Nếu có phản hồi ẩn, hiển thị nút "Xem thêm"
                      <strong
                        onClick={loadMoreReplies}
                        className="ml-3 custom-cursor"
                      >
                        Xem phản hồi khác{" "}
                        <i className="bi bi-chevron-compact-down"></i>
                      </strong>
                    ) : (
                      <strong
                        onClick={hideReplies}
                        className="ml-auto custom-cursor"
                      >
                        Ẩn bớt <i className="bi bi-chevron-compact-up pl-1"></i>
                      </strong>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="fst-italic ml-5 mt-2 pl-2">
          <p>- Hiện chưa thể xem phản hồi -</p>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
