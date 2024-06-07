var connect = require('./database');
var Post = [];;
module.exports = class Post {
    constructor() { }
    // All List 
    static fetchAll() {
        return new Promise((resolve, reject) => {
            connect.query('SELECT * FROM post', (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
    // Add 
    static createPost(post) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO post SET ?`;
            connect.query(sql, post, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    // Update 
    static updatePost(post, postId) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE post SET ? WHERE id = ${postId}`;
            connect.query(sql, [post, postId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }

            });
        });
    }
    // Edit 
    static async getEdit(postId) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM post WHERE id = ${postId}`;
            connect.query(sql, [postId], function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    // Delete 
    static deletePost(postId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM post WHERE id = ${postId}`;
            connect.query(sql, [postId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

}