var connect = require('./database');
var Post = [];
module.exports = class Post {
    constructor() { }
    static fetchAll(from, row) {
        return new Promise((resolve, reject) => {
            connect.query('SELECT post.*, customers.images AS images_customers, customers.username, (SELECT COUNT(*) FROM comments WHERE post_id = post.id) AS total_comments FROM post JOIN customers ON post.customers_id = customers.id LIMIT ?,?;', [from, row], (err, result) => {
                if (err) reject(err);
                resolve(result);
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
    static async getAllPost(from, row) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT post.*, categories.id AS categories_id, categories.name AS category_name, customers.id AS customers_id, customers.username, customers.images AS images_customers, (SELECT COUNT(*) FROM comments WHERE post_id = post.id) AS total_comments FROM post JOIN categories ON post.categories_id = categories.id JOIN customers ON post.customers_id = customers.id LIMIT ?,?;`
            connect.query(sql, [from, row], function (err, data) {
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
    // getUsername
    static async search(key) {
      return new Promise((resolve, reject) => {
        let sql = `SELECT post.*, categories.id AS categories_id, categories.name AS category_name, customers.id AS customers_id, customers.username, customers.images AS images_customers, (SELECT COUNT(*) FROM comments WHERE post_id = post.id) AS total_comments FROM post JOIN categories ON post.categories_id = categories.id JOIN customers ON post.customers_id = customers.id WHERE LOWER(post.title) LIKE ?`;
        connect.query(sql, [`%${key}%`], function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
            const keywords = data.map((item) => item.title);
            resolve(keywords);
          }
        });
      });
    }

  static async suggestKeywords(key) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT DISTINCT title FROM post WHERE LOWER(title) LIKE ?`;
      connect.query(sql, [`%${key}%`], function (err, data) {
        if (err) {
          reject(err);
        } else {
          const keywords = data.map((item) => item.title);
          resolve(keywords);
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
          MONTH(date) AS month,
          COUNT(*) AS post_count
        FROM post
        GROUP BY MONTH(date)
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
