import React, { useState, useEffect, useMemo, useCallback } from "react";
import getSocket from "../../../config/socket";
import CommentItem from "./CommentItem";
import CommentBox from "./CommentBox";

const CommentList = React.memo(
  ({ postId, customer, onUpdateTotalComments, totalComments }) => {
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState([]);
    const [visibleRepliesMap, setVisibleRepliesMap] = useState({});
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const repliesLimit = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [totalParentComments, setTotalParentComments] = useState(0);
    const [totalAllComments, setTotalAllComments] = useState(totalComments);
    const [editingComment, setEditingComment] = useState(null);
    const socketInstance = useMemo(() => getSocket(), []);

    useEffect(() => {
      if (onUpdateTotalComments) {
        onUpdateTotalComments(postId, totalAllComments);
      }
    }, [totalAllComments, postId, onUpdateTotalComments]);

    const loadComments = useCallback(() => {
      if (!postId) return;
      setIsLoading(true);
      setError(null);
      socketInstance.emit("Get_comments", { postId, page, limit });
    }, [postId, page, limit, socketInstance]);

    const displayedReplies = useMemo(() => {
      const result = {};
      Object.keys(replies).forEach((parentId) => {
        result[parentId] = replies[parentId].slice(
          0,
          visibleRepliesMap[parentId] || 0
        );
      });
      return result;
    }, [replies, visibleRepliesMap]);

    useEffect(() => {
      if (postId) {
        const handleNewParentComment = (newComment) => {
          if (newComment.post_id === postId) {
            setComments((prevComments) => [newComment, ...prevComments]);
            setTotalParentComments((prevTotal) => prevTotal + 1);
            setTotalAllComments((prevTotal) => prevTotal + 1);
          }
        };

        const handleNewChildComment = (newChildComment) => {
          setReplies((prevReplies) => {
            const updatedReplies = { ...prevReplies };
            if (!updatedReplies[newChildComment.parent_id]) {
              updatedReplies[newChildComment.parent_id] = [];
            }
            if (
              !updatedReplies[newChildComment.parent_id].some(
                (reply) => reply.id === newChildComment.id
              )
            ) {
              updatedReplies[newChildComment.parent_id] = [
                newChildComment,
                ...updatedReplies[newChildComment.parent_id],
              ];
            }
            return updatedReplies;
          });
          setTotalAllComments((prevTotal) => prevTotal + 1);

          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === newChildComment.parent_id
                ? { ...comment, totalReplies: (comment.totalReplies || 0) + 1 }
                : comment
            )
          );
        };

        const handleUpdatedComment = (updatedComment) => {
          if (updatedComment.parent_id) {
            setReplies((prevReplies) => {
              const updatedReplies = { ...prevReplies };
              if (updatedReplies[updatedComment.parent_id]) {
                updatedReplies[updatedComment.parent_id] = updatedReplies[
                  updatedComment.parent_id
                ].map((reply) =>
                  reply.id === updatedComment.id ? updatedComment : reply
                );
              }
              return updatedReplies;
            });
          } else {
            setComments((prevComments) =>
              prevComments.map((comment) =>
                comment.id === updatedComment.id ? updatedComment : comment
              )
            );
          }
        };

        const handleDeletedComment = (deletedComment) => {
          if (deletedComment.parentId) {
            setReplies((prevReplies) => {
              const updatedReplies = { ...prevReplies };
              if (updatedReplies[deletedComment.parentId]) {
                updatedReplies[deletedComment.parentId] = updatedReplies[
                  deletedComment.parentId
                ].filter((reply) => reply.id !== deletedComment.id);
              } else {
                console.warn(
                  `Không tìm thấy replies cho parentId: ${deletedComment.parentId}`
                );
              }
              return updatedReplies;
            });

            setComments((prevComments) =>
              prevComments.map((comment) =>
                comment.id === deletedComment.parentId
                  ? {
                      ...comment,
                      totalReplies: Math.max(
                        (comment.totalReplies || 1) - 1,
                        0
                      ),
                    }
                  : comment
              )
            );

            setTotalAllComments((prevTotal) => {
              const newTotal = prevTotal - 1;
              return newTotal;
            });
          } else {
            setComments((prevComments) => {
              const newComments = prevComments.filter(
                (comment) => comment.id !== deletedComment.id
              );

              return newComments;
            });

            const childCommentsCount = replies[deletedComment.id]?.length || 0;

            setTotalAllComments((prevTotal) => {
              const newTotal = prevTotal - (1 + childCommentsCount);

              return newTotal;
            });

            setReplies((prevReplies) => {
              const updatedReplies = { ...prevReplies };
              delete updatedReplies[deletedComment.id];

              return updatedReplies;
            });

            setTotalParentComments((prevTotal) => {
              const newTotalParent = prevTotal - 1;

              return newTotalParent;
            });
          }
        };

        socketInstance.on("New_parent_comment", handleNewParentComment);
        socketInstance.on("New_child_comment", handleNewChildComment);
        socketInstance.on("Updated_comment", handleUpdatedComment);
        socketInstance.on("Deleted_comment", handleDeletedComment);

        return () => {
          socketInstance.off("New_parent_comment", handleNewParentComment);
          socketInstance.off("New_child_comment", handleNewChildComment);
          socketInstance.off("Updated_comment", handleUpdatedComment);
          socketInstance.off("Deleted_comment", handleDeletedComment);
        };
      }
    }, [postId, socketInstance]);

    useEffect(() => {
      if (postId) {
        const handleAllComments = ({
          comments: newComments,
          totalComments,
          totalPages: receivedTotalPages,
        }) => {
          setComments((prevComments) => {
            const uniqueComments = new Map();
            [...prevComments, ...newComments].forEach((comment) => {
              if (comment.post_id === postId) {
                uniqueComments.set(comment.id, {
                  ...comment,
                  totalReplies: comment.totalReplies || 0,
                });
              }
            });
            return Array.from(uniqueComments.values());
          });
          setTotalParentComments(totalComments);
          setTotalPages(receivedTotalPages);
          setIsLoading(false);
        };

        const handleError = (errorMessage) => {
          setError(errorMessage.message || "Có lỗi xảy ra");
          setIsLoading(false);
        };

        socketInstance.on("Parent_comments", handleAllComments);
        socketInstance.on("Error", handleError);

        if (postId && !isLoading) {
          loadComments();
        }

        return () => {
          socketInstance.off("Parent_comments", handleAllComments);
          socketInstance.off("Error", handleError);
        };
      }
    }, [postId, socketInstance, loadComments]);

    const loadMoreComments = () => {
      if (isLoading || page >= totalPages) return;
      try {
        setIsLoading(true);
        const nextPage = page + 1;
        setPage(nextPage);
        socketInstance.emit("Get_comments", { postId, page: nextPage, limit });
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thêm bình luận.");
        setIsLoading(false);
      }
    };

    const handleEdit = (comment) => {
      setEditingComment(comment);
    };

    const handleDelete = (commentId) => {
      try {
        if (commentId) {
          socketInstance.emit("Delete_comment", { id: commentId });
        } else {
          console.error(
            "Invalid commentId provided to handleDelete:",
            commentId
          );
        }
      } catch (err) {
        console.error("Có lỗi xảy ra khi xóa bình luận:", err);
        setError("Có lỗi xảy ra khi xóa bình luận.");
      }
    };

    const handleCommentSubmit = (newCommentData) => {
      if (editingComment) {
        socketInstance.emit("Edit_comment", {
          id: editingComment.id,
          post_id: newCommentData.post_id,
          customers_id: newCommentData.customers_id,
          contents: newCommentData.contents,
          rating: newCommentData.rating,
        });
        setEditingComment(null);
      } else {
        socketInstance.emit("Send_message", {
          post_id: newCommentData.post_id,
          customers_id: newCommentData.customers_id,
          contents: newCommentData.contents,
          rating: newCommentData.rating,
        });
      }
    };

    const loadMoreReplies = (parentId, replyPage, replyLimit) => {
      if (!parentId || isLoading) return;

      setIsLoading(true);
      setError(null);

      socketInstance.emit("Get_child_comments", {
        parentId,
        replyPage,
        replyLimit,
      });

      socketInstance.once("Child_comments", (response) => {
        if (response.parentId === parentId) {
          setReplies((prevReplies) => {
            const updatedReplies = { ...prevReplies };
            if (!updatedReplies[parentId]) {
              updatedReplies[parentId] = [];
            }
            const newReplies = response.childComments.filter(
              (newReply) =>
                !updatedReplies[parentId].some(
                  (reply) => reply.id === newReply.id
                )
            );
            updatedReplies[parentId] = [
              ...newReplies,
              ...updatedReplies[parentId],
            ];
            return updatedReplies;
          });

          setVisibleRepliesMap((prevMap) => ({
            ...prevMap,
            [parentId]:
              (prevMap[parentId] || 0) + response.childComments.length,
          }));
        }
        setIsLoading(false);
      });

      socketInstance.once("Error", (error) => {
        setError("Có lỗi xảy ra khi tải thêm phản hồi.");
        setIsLoading(false);
      });
    };

    const onHideReplies = (parentId) => {
      setVisibleRepliesMap((prevMap) => ({
        ...prevMap,
        [parentId]: 0,
      }));
    };

    const displayedComments = useMemo(() => comments, [comments]);

    return (
      <div className="comment-list">
        {displayedComments.map((comment) => (
          <CommentItem
            key={comment?.id}
            comment={comment}
            replies={displayedReplies[comment?.id] || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            userId={customer?.id}
            customer={customer || [ ]}
            totalReplies={comment?.totalReplies}
            onLoadMoreReplies={loadMoreReplies}
            onHideReplies={onHideReplies}
            repliesLimit={repliesLimit}
            visibleReplies={visibleRepliesMap[comment?.id] || 0}
          />
        ))}
        {isLoading && <div>Đang tải...</div>}

        {displayedComments.length < totalParentComments && (
          <div
            className="load-more-container"
            style={{ textAlign: "center", margin: "20px 0", cursor: "pointer" }}
          >
            <strong
              onClick={loadMoreComments}
              disabled={isLoading}
              style={{
                fontSize: "16px",
                color: "#65676B",
                cursor: "pointer",
              }}
            >
              {isLoading ? "Đang tải..." : "Tải thêm bình luận"}
            </strong>
          </div>
        )}

        {customer?.id && (
          <CommentBox
            postId={postId}
            customer={customer || []}
            commentToEdit={editingComment}
            setCommentToEdit={setEditingComment}
            onSubmit={handleCommentSubmit}
          />
        )}

        {error && (
          <div
            className="error-message"
            style={{ color: "red", textAlign: "center" }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);

export default CommentList;
