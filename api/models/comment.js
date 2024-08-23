var connect = require('./database');

module.exports = class Comments {
    constructor() { }
    
    // Lấy tất cả bình luận
    static fetchAll() {
        return new Promise((resolve, reject) => {
            connect.query('SELECT * FROM comments', (err, result) => {
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
            let sql = `SELECT p.id, p.title, p.images, COUNT(*) so_luong, MIN(cmt.date) cu_nhat, MAX(cmt.date) moi_nhat 
                       FROM comments cmt 
                       JOIN post p ON p.id = cmt.post_id 
                       GROUP BY p.id, p.title 
                       HAVING so_luong > 0 
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
    
    // Cập nhật nội dung bình luận
    static updateComment(commentId, newContent) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE comments SET contents = ? WHERE id = ?`;
            connect.query(sql, [newContent, commentId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // Xóa bình luận theo id
    static deleteComment(commentId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM comments WHERE id = ?`;
            connect.query(sql, [commentId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
};