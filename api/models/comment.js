var connect = require("./database");

module.exports = class Comments {
  constructor() {}

  // Lấy tất cả bình luận
  static fetchAll() {
    return new Promise((resolve, reject) => {
      connect.query("SELECT * FROM comments", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  // Thêm bình luận
  static createComment(users) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO comments SET ?`;
      connect.query(sql, users, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  // Lấy danh sách bình luận theo phân trang
  static async getList(from, row) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT 
    p.id, 
    p.title, 
    p.images, 
    (COUNT(DISTINCT cmt.id) + COUNT(DISTINCT rc.id)) AS so_luong,
    MIN(cmt.date) AS cu_nhat,
    MAX(cmt.date) AS moi_nhat
FROM 
    post p
LEFT JOIN comments cmt ON p.id = cmt.post_id
LEFT JOIN repcomments rc ON cmt.id = rc.original_comment_id
GROUP BY p.id, p.title
HAVING (COUNT(DISTINCT cmt.id) + COUNT(DISTINCT rc.id)) > 0
                       LIMIT ?, ?`;
      connect.query(sql, [from, row], function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Đếm tổng số bình luận
  static async countComment() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT COUNT(*) AS count FROM comments`;
      connect.query(sql, function (err, data) {
        if (err) reject(err);
        else resolve(data[0].count);
      });
    });
  }

  // Lấy bình luận theo id của bài viết
  static async getByPostId(postId) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT cmt.*, customers.username, customers.images 
                       FROM comments cmt 
                       JOIN post ON post.id = cmt.post_id 
                       JOIN customers ON cmt.customers_id = customers.id 
                       WHERE cmt.post_id = ? 
                       ORDER BY cmt.date DESC`;
      connect.query(sql, [postId], function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Lấy bình luận theo ID
  static async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM comments WHERE id = ?`;
      connect.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // Trả về bình luận đầu tiên (chỉ có một)
      });
    });
  }

  // Cập nhật nội dung bình luận
  static updateComment(commentId, data) {
    return new Promise((resolve, reject) => {
      const { contents, rating } = data; // Thêm rating nếu cần
      const sql = `UPDATE comments SET contents = ?, rating = ? WHERE id = ?`;
      connect.query(sql, [contents, rating, commentId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Xóa bình luận theo ID
  static async deleteComment(commentId) {
    // Kiểm tra xem bình luận có tồn tại hay không
    const commentExists = await this.getById(commentId);
    if (!commentExists) {
      throw new Error("Comment not found");
    }

    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM comments WHERE id = ?`;
      connect.query(sql, [commentId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
};
