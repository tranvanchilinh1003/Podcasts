// models/comments.js

const connect = require("./database");

module.exports = class Comments {
  constructor() {}

  /**
   * Retrieves paginated comments for a specific post, including user data.
   */
  static async getPaginatedCommentsByPostId(postId, offset, limit) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT cmt.*, customers.username, customers.images 
        FROM comments cmt 
        LEFT JOIN customers ON cmt.customers_id = customers.id 
        WHERE cmt.post_id = ? AND cmt.parent_id IS NULL 
        ORDER BY cmt.date DESC 
        LIMIT ?, ?`;
      connect.query(sql, [postId, offset, limit], (err, comments) => {
        if (err) reject(err);
        else resolve(comments); // Không còn lặp lấy bình luận con ở đây
      });
    });
  }

  static async getChildComments(parentId, offset, limit) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT cmt.*, customers.username, customers.images 
                   FROM comments cmt 
                   LEFT JOIN customers ON cmt.customers_id = customers.id 
                   WHERE cmt.parent_id = ? 
                   ORDER BY cmt.date DESC 
                   LIMIT ? OFFSET ?`;
      connect.query(sql, [parentId, limit, offset], (err, data) => {
        if (err) reject(err);
        else resolve(data); // Trả về dữ liệu phân trang
      });
    });
  }

  static async countCommentsByParentId(parentId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) AS count FROM comments WHERE parent_id = ?`;
      connect.query(sql, [parentId], (err, data) => {
        if (err) reject(err);
        else resolve(data[0].count);
      });
    });
  }

  static async countParentCommentsByPostId(postId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) AS count FROM comments WHERE post_id = ? AND parent_id IS NULL`;
      connect.query(sql, [postId], (err, data) => {
        if (err) reject(err);
        else resolve(data[0].count);
      });
    });
  }

  static async createComment(commentData) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO comments (customers_id, post_id, contents, rating, parent_id, date) 
                   VALUES (?, ?, ?, ?, ?, NOW())`;
      const values = [
        commentData.customers_id,
        commentData.post_id,
        commentData.contents,
        commentData.rating,
        commentData.parent_id || null, 
      ];

      connect.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const insertedId = result.insertId;
        const selectSql = `
          SELECT cmt.*, customers.username, customers.images 
          FROM comments cmt 
          LEFT JOIN customers ON cmt.customers_id = customers.id 
          WHERE cmt.id = ?`;
        connect.query(selectSql, [insertedId], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length === 0) {
            reject(new Error("Không tìm thấy bình luận vừa tạo."));
            return;
          }

          resolve(rows[0]);
        });
      });
    });
  }


  /**
   * Retrieves a single comment by its ID, including user data.
   */
  static async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT cmt.*, customers.username, customers.images 
        FROM comments cmt 
        LEFT JOIN customers ON cmt.customers_id = customers.id 
        WHERE cmt.id = ?`;
      connect.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  /**
   * Updates an existing comment and retrieves the updated comment with user data.
   */
  static async updateComment(commentId, data) {
    return new Promise((resolve, reject) => {
      const { contents, rating } = data;
      const sql = `UPDATE comments SET contents = ?, rating = ? WHERE id = ?`;
      connect.query(sql, [contents, rating, commentId], (err, result) => {
        if (err) return reject(err);

        // Lấy lại bình luận đã cập nhật với thông tin người dùng
        const selectSql = `
          SELECT cmt.*, customers.username, customers.images 
          FROM comments cmt 
          LEFT JOIN customers ON cmt.customers_id = customers.id 
          WHERE cmt.id = ?`;
        connect.query(selectSql, [commentId], (err, rows) => {
          if (err) return reject(err);
          if (rows.length === 0) {
            reject(new Error("Không tìm thấy bình luận sau khi cập nhật."));
            return;
          }
          resolve(rows[0]); // Trả về bình luận đã cập nhật với thông tin người dùng
        });
      });
    });
  }
  /**
   * Deletes a comment by its ID and returns the deleted comment data.
   */
/**
 * Deletes a comment by its ID and returns the deleted comment data along with its child comments.
 */
static async deleteComment(commentId) {
  console.log("Attempting to delete comment with ID:", commentId);

  // Kiểm tra bình luận trước khi xóa
  const commentExists = await this.getById(commentId);
  console.log("Comment fetched for deletion:", commentExists);

  if (!commentExists) {
    console.error("Comment not found before deletion for ID:", commentId);
    throw new Error("Comment not found");
  }

  try {
    // Lấy tất cả các bình luận con trước khi xóa
    const childComments = await this.getChildCommentsRecursively(commentId);
    const allDeletedComments = [commentExists, ...childComments];

    // Xóa các bình luận con
    const sqlDeleteChildren = `DELETE FROM comments WHERE parent_id = ?`;
    await new Promise((resolve, reject) => {
      connect.query(sqlDeleteChildren, [commentId], (err) => {
        if (err) {
          console.error("Error deleting child comments:", err);
          return reject(err);
        }
        console.log("Deleted child comments for parent ID:", commentId);
        resolve();
      });
    });

    // Xóa bình luận cha
    const sqlDeleteParent = `DELETE FROM comments WHERE id = ?`;
    await new Promise((resolve, reject) => {
      connect.query(sqlDeleteParent, [commentId], (err, result) => {
        if (err) {
          console.error("Error deleting parent comment:", err);
          return reject(err);
        }
        console.log("Deleted parent comment with ID:", commentId);
        resolve(result);
      });
    });

    // Trả về danh sách các bình luận đã bị xóa (bao gồm cả bình luận cha và các bình luận con)
    return allDeletedComments;
  } catch (error) {
    console.error("Error during deletion:", error);
    throw new Error("Failed to delete comment: " + error.message);
  }
}

/**
 * Retrieves all child comments recursively for a given parent comment ID.
 */
static async getChildCommentsRecursively(parentId) {
  const childComments = [];
  const getChildren = async (parentId) => {
    const children = await this.getChildComments(parentId, 0, Number.MAX_SAFE_INTEGER);
    for (const child of children) {
      childComments.push(child);
      await getChildren(child.id); // Lấy các bình luận con của bình luận con (nếu có)
    }
  };
  await getChildren(parentId);
  return childComments;
}

  
};
