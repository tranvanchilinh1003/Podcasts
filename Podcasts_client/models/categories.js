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

    static createCategories(category) {
        return new Promise((resolve, reject) => {
            connect.query("INSERT INTO categories SET ?", category, (err, result) => {
                if (err){
                    reject(err);                  
                } else{
                    resolve(result);
                }
               
            });
        });
    }

    static getUpdateCategories(categoryId) {
        return new Promise((resolve, reject) => {
            connect.query(`SELECT * FROM categories WHERE id = ${categoryId}`, (err, result) => {
                if (err){
                    reject(err);                  
                } else{
                    resolve(result);
                }
               
            });
        });
    }

    static updateCategories(category,categoryId) {
        return new Promise((resolve, reject) => {
            connect.query(`UPDATE categories SET ? WHERE id = ?`, [category, categoryId], (err, result) => {
                if (err){
                    reject(err);                  
                } else{
                    resolve(result);
                }
               
            });
        });
    }

    static deleteCategories(categoryId) {
        return new Promise((resolve, reject) => {
            connect.query(
            'DELETE FROM categories WHERE id = ?',
            [categoryId],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
      }
      static async countProducts() {
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