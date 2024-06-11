var connect = require('./database');
var shares = [];
module.exports = class Shares {
    constructor() { }
    static fetchAll(from, row) {
        return new Promise((resolve, reject) => {
            connect.query('SELECT p.id AS id, p.title, p.images, COUNT(*) AS so_luong, MIN(sh.date) AS cu_nhat, MAX(sh.date) AS moi_nhat, c.username FROM share sh JOIN post p ON p.id = sh.post_id JOIN customers c ON c.id = sh.customers_id GROUP BY sh.id, p.id, p.title, c.username HAVING so_luong > 0 LIMIT ?,?',[from, row], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
    static async countShare() {
        return new Promise((resolve, reject) => {
          let sql = `SELECT COUNT(*) AS count FROM share`; 
          connect.query(sql, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data[0].count);
            }
          });
        });
    }
    static async getId(id) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT share.*, customers.username, customers.images FROM share JOIN post ON post.id = share.post_id JOIN customers ON share.customers_id = customers.id WHERE post_id = ${id} ORDER BY date DESC;`;
            connect.query(sql, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            connect.query('DELETE FROM share WHERE id = ?', [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}