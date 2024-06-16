var connect = require('./database');
var Post = [];;
module.exports = class Post {
    constructor() { }
    // All List 
    static fetchAll() {
        return new Promise((resolve, reject) => {
            connect.query('SELECT * FROM comments', (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
    // Add 
    static createComment(users) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO comments SET ?`;
            connect.query(sql, users, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    // Edit 
    // static async getEdit(commentId) {
    //     return new Promise((resolve, reject) => {
    //         let sql = `SELECT * FROM comments WHERE id = ${commentId}`;
    //         connect.query(sql, [commentId], function (err, data) {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(data);
    //             }
    //         });
    //     });
    // }
    static async getList(from, row) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT p.id, p.title, p.images, COUNT(*) so_luong,MIN(cmt.date) cu_nhat,MAX(cmt.date) moi_nhat FROM comments cmt 
            JOIN post p ON p.id = cmt.post_id 
            GROUP BY p.id, p.title 
            HAVING so_luong > 0 LIMIT ?,?`;
            connect.query(sql,[from, row], function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    static async countComment() {
        return new Promise((resolve, reject) => {
          let sql = `SELECT COUNT(*) AS count FROM comments`; 
          connect.query(sql, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data[0].count);
            }
          });
        });
    }
    static async getId(commentId) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT cmt.*, customers.username, customers.images FROM comments cmt JOIN post ON post.id = cmt.post_id JOIN customers ON cmt.customers_id = customers.id WHERE cmt.post_id = ${commentId} ORDER BY date DESC;`;
            connect.query(sql, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

     // Delete 
     static deleteComment(commentId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM comments WHERE id = ${commentId}`;
            connect.query(sql, [commentId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}