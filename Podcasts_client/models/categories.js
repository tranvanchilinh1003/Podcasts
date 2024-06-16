var connect = require('./database');
var categories = [];
module.exports = class Categories {
    constructor() {}
    static fetchAll(from, row) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM categories LIMIT ?,?`;
            connect.query(sql, [from, row], function (err, data) {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
          });
    }
    static getCateId(categoriesId) {
        return new Promise((resolve, reject) => {
            connect.query(`SELECT post.*, categories.id AS categories_id, categories.name AS category_name, customers.id AS customers_id, customers.username, customers.images AS images_customers, (SELECT COUNT(*) FROM comments WHERE post_id = post.id) AS total_comments FROM post JOIN categories ON post.categories_id = categories.id JOIN customers ON post.customers_id = customers.id WHERE categories_id = ${categoriesId};`, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static createCategories(category) {
        return new Promise((resolve, reject) => {
            connect.query("INSERT INTO categories SET ?", category, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }

            });
        });
    }

    static getUpdateCategories(categoryId) {
        return new Promise((resolve, reject) => {
            connect.query(`SELECT * FROM categories WHERE id = ${categoryId}`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }

            });
        });
    }

    static updateCategories(category, categoryId) {
        return new Promise((resolve, reject) => {
            connect.query(`UPDATE categories SET ? WHERE id = ?`, [category, categoryId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }

            });
        });
    }

    static deleteCategories(categoryId) {
        return new Promise((resolve, reject) => {
            connect.query(
                `DELETE FROM categories WHERE id = ${categoryId} AND (SELECT COUNT(*) FROM post WHERE categories_id = ${categoryId}) = 0;`,
                (err, result) => {
                    if (err) {
                        reject(err); // Trả về lỗi nếu có lỗi xảy ra
                    } else {
                        if (result.affectedRows > 0) {
                            resolve(result); // Nếu có hàng bị ảnh hưởng, trả về kết quả
                        } else {
                            reject("Không thể xóa danh mục vì có bài viết đang sử dụng nó."); // Nếu không có hàng nào bị ảnh hưởng, trả về thông báo lỗi
                        }
                    }
                }
            );
        });
    }
    
      static async countCategories() {
        return new Promise((resolve, reject) => {
          let sql = `SELECT COUNT(*) AS count FROM categories`; 
          connect.query(sql, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data[0].count);
            }
          });
        });
    }
}