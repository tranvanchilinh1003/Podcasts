var connect = require('./database');
var Post = [];
module.exports = class Post {
    constructor() { }
    static fetchAll(from , row) {
        return new Promise((resolve, reject) => {
            connect.query('SELECT post.*, customers.images AS images_customers, customers.username, COUNT(DISTINCT comments.id) AS total_comments, COUNT(DISTINCT favourite.id) AS total_favorites, COUNT(DISTINCT share.id) AS total_shares FROM post JOIN customers ON post.customers_id = customers.id LEFT JOIN comments ON post.id = comments.post_id LEFT JOIN favourite ON post.id = favourite.post_id LEFT JOIN share ON post.id = share.post_id GROUP BY post.id ORDER By post.create_date DESC LIMIT ?,?', [from, row], 
                  (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
    static async getPostClient() {
        return new Promise((resolve, reject) => {
            connect.query('SELECT post.*, customers.images AS images_customers, customers.username, COUNT(DISTINCT comments.id) AS total_comments, COUNT(DISTINCT favourite.id) AS total_favorites, COUNT(DISTINCT share.id) AS total_shares FROM post JOIN customers ON post.customers_id = customers.id LEFT JOIN comments ON post.id = comments.post_id LEFT JOIN favourite ON post.id = favourite.post_id LEFT JOIN share ON post.id = share.post_id GROUP BY post.id ORDER BY view DESC LIMIT 6;', (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
    static async coutCustomers() {
        return new Promise((resolve, reject) => {
            let sql = `SELECT COUNT(*) AS count FROM post`;
            connect.query(sql, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data[0].count);
                }
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
    // View 
    static post_view(postId) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE post SET view = view + 1 WHERE id= ${postId}`;
            connect.query(sql, (err, result) => {
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
    //getCate và Post
    static async getIdPost(postId) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT post.*, categories.id AS categories_id, categories.name AS category_name, customers.id AS customers_id, customers.username, customers.images AS images_customers FROM post JOIN categories ON post.categories_id = categories.id JOIN customers ON post.customers_id = customers.id WHERE post.id = ${postId};`;
            connect.query(sql, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    //get All Pots Cate
    static async getAllPost() {
        return new Promise((resolve, reject) => {
            let sql = `SELECT post.*, customers.images AS images_customers, customers.username, customers.isticket, COUNT(DISTINCT comments.id) AS total_comments, COUNT(DISTINCT favourite.id) AS total_favorites, COUNT(DISTINCT share.id) AS total_shares FROM post JOIN customers ON post.customers_id = customers.id LEFT JOIN comments ON post.id = comments.post_id LEFT JOIN favourite ON post.id = favourite.post_id LEFT JOIN share ON post.id = share.post_id GROUP BY post.id ORDER BY view DESC ;`
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
    static deletePost(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM post WHERE id = ${id} AND (SELECT COUNT(*) FROM comments WHERE comments.post_id = ${id}) = 0;`;
            connect.query(sql, [id], (err, result) => {
                if (err) {
                    reject(err); // Trả về lỗi nếu có lỗi xảy ra
                } else {
                    if (result.affectedRows > 0) {
                        resolve(result); // Nếu có hàng bị ảnh hưởng, trả về kết quả
                    } else {
                        reject("Không thể xóa bài đăng vì có bài comment trong bài đăng này."); // Nếu không có hàng nào bị ảnh hưởng, trả về thông báo lỗi
                    }
                }
            }
        );
    
        });
    }
    // getUsername
    static async search(key) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT post.*, categories.id AS categories_id, categories.name AS category_name, customers.id AS customers_id, customers.username, customers.images AS images_customers, (SELECT COUNT(*) FROM comments WHERE post_id = post.id) AS total_comments FROM post JOIN categories ON post.categories_id = categories.id JOIN customers ON post.customers_id = customers.id WHERE LOWER(post.title) LIKE ?`;
            connect.query(sql, [`%${key}%`], function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

  static async suggestKeywords(key) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT DISTINCT images,  title FROM post WHERE LOWER(title) LIKE ?`;
      connect.query(sql, [`%${key}%`], function (err, data) {
        if (err) {
          reject(err);
        } else {
            const suggestions = data.map(item => ({
                title: item.title,
                images: item.images
            }));
             resolve(suggestions)
        }
      });
    });
  }

  static async countByKey(key) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT COUNT(*) AS count 
                   FROM post 
                   WHERE LOWER(title) LIKE ?`;

        connect.query(sql, [`%${key}%`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].count);
            }
        });
    });
}

  static async getData() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT lo.id, lo.name, COUNT(*) so_luong FROM post JOIN categories lo   ON lo.id = post.categories_id GROUP BY lo.id, lo.name  `;
      connect.query(sql, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  static async getChart(){
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          MONTH(create_date) AS month,
          COUNT(*) AS post_count
        FROM post
        GROUP BY MONTH(create_date)
        ORDER BY month ASC
      `;
      connect.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
};
