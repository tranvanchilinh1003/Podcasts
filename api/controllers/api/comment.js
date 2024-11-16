const Comment = require("../../models/comment");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
    });
    socket.on("error", (err) => {
      socket.emit("Error", { message: "Connection failed", error: err });
    });

    try {
      socket.page = 1;
      socket.limit = 10;
      socket.currentPostId = null;

      socket.on(
        "Get_comments",
        async ({ postId, page: clientPage, limit: clientLimit }) => {
          try {
            if (!postId) {
              socket.emit("Error", {
                message: "postId is required",
                status: 400,
              });
              return;
            }

            socket.page = clientPage || socket.page;
            socket.limit = clientLimit || socket.limit;
            socket.currentPostId = postId;

            const offset = (socket.page - 1) * socket.limit;
            const comments = await Comment.getPaginatedCommentsByPostId(
              postId,
              offset,
              socket.limit
            );

            for (const comment of comments) {
              const totalReplies = await Comment.countCommentsByParentId(
                comment.id
              );
              comment.totalReplies = totalReplies;
            }

            const totalComments = await Comment.countParentCommentsByPostId(
              postId
            );

            socket.emit("Parent_comments", {
              comments,
              totalComments,
              page: socket.page,
              totalPages: Math.ceil(totalComments / socket.limit),
            });
          } catch (error) {
            console.error("Lỗi khi lấy bình luận:", error);
            socket.emit("Error", {
              message: "Failed to fetch comments",
              status: 500,
            });
          }
        }
      );

      socket.on(
        "Get_child_comments",
        async ({ parentId, replyPage, replyLimit }) => {
          try {
            if (!parentId || !replyPage || !replyLimit) {
              socket.emit("Error", {
                message: "Missing required parameters",
                status: 400,
              });
              return;
            }

            const totalReplies = await Comment.countCommentsByParentId(
              parentId
            );
            const childOffset = (replyPage - 1) * replyLimit;
            const childComments = await Comment.getChildComments(
              parentId,
              childOffset,
              replyLimit
            );

            // Tính toán `totalReplies` cho mỗi phản hồi con
            for (const childComment of childComments) {
              const totalChildReplies = await Comment.countCommentsByParentId(
                childComment.id
              );
              childComment.totalReplies = totalChildReplies;
            }

            socket.emit("Child_comments", {
              parentId,
              childComments,
              replyPage,
              totalReplies,
              totalPages: Math.ceil(totalReplies / replyLimit),
            });
          } catch (error) {
            console.error("Lỗi khi lấy bình luận con:", error);
            socket.emit("Error", {
              message: "Failed to fetch child comments",
              status: 500,
            });
          }
        }
      );

      socket.on("Send_message", async (data) => {
        try {
          const comment = await Comment.createComment(data);

          console.log(comment);

          if (comment.parent_id) {
            io.emit("New_child_comment", comment);
          } else {
            io.emit("New_parent_comment", comment);
          }
        } catch (error) {
          console.error("Lỗi khi thêm bình luận:", error);
          socket.emit("Error", {
            message: "Failed to add comment",
            status: 500,
          });
        }
      });

      socket.on("Edit_comment", async (data) => {
        try {
          if (!data.id) {
            socket.emit("Error", {
              message: "Comment ID is required",
              status: 400,
            });
            return;
          }
          const editedComment = await Comment.updateComment(data.id, data);
          io.emit("Updated_comment", editedComment); // Phát sự kiện khi chỉnh sửa bình luận
        } catch (error) {
          console.error("Lỗi khi chỉnh sửa bình luận:", error);
          socket.emit("Error", {
            message: "Failed to edit comment",
            status: 500,
          });
        }
      });
      socket.on("Delete_comment", async (data) => {
        try {
          if (!data.id) {
            socket.emit("Error", {
              message: "Comment ID is required",
              status: 400,
            });
            return;
          }
      
          // Kiểm tra xem bình luận có tồn tại trước khi thực hiện xóa không
          const existingComment = await Comment.getById(data.id);
          if (!existingComment) {
            console.log(
              "Comment already deleted or not found with ID:",
              data.id
            );
            socket.emit("Error", {
              message: "Comment already deleted or not found",
              status: 404,
            });
            return;
          }
      
          // Thực hiện xóa bình luận và các bình luận con nếu có
          const deletedComments = await Comment.deleteComment(data.id);
      
          if (deletedComments && deletedComments.length > 0) {
            deletedComments.forEach((deletedComment) => {
              console.log("Emitting Deleted_comment for:", {
                id: deletedComment.id,
                parentId: deletedComment.parent_id || null,
              });
              io.emit("Deleted_comment", {
                id: deletedComment.id,
                parentId: deletedComment.parent_id || null,
              });
            });
          } else {
            console.error(
              "Comment not found, cannot emit Deleted_comment for ID:",
              data.id
            );
            socket.emit("Error", {
              message: "Comment not found",
              status: 404,
            });
          }
        } catch (error) {
          console.error("Lỗi khi xóa bình luận:", error);
          socket.emit("Error", {
            message: "Failed to delete comment",
            status: 500,
          });
        }
      });
      
    } catch (error) {
      console.error("Lỗi khi kết nối socket:", error);
    }
  });
};
