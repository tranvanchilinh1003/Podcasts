var connect = require("./database");
var favourite = [];
module.exports = class Favourite {
  constructor() {}
  static fetchAll(from, row) {
    return new Promise((resolve, reject) => {
      connect.query(
        "SELECT  p.id AS id, p.title, p.images, COUNT(*) AS so_luong, MIN(fa.date) AS cu_nhat, MAX(fa.date) AS moi_nhat, c.username FROM favourite fa JOIN post p ON p.id = fa.post_id JOIN customers c ON c.id = fa.customers_id GROUP BY fa.id, p.id, p.title, c.username HAVING so_luong > 0  LIMIT ?,?",
        [from, row],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  static async countFavourite() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT COUNT(*) AS count FROM favourite`;
      connect.query(sql, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data[0].count);
        }
      });
    });
  }
  static delete(id) {
    return new Promise((resolve, reject) => {
      connect.query(
        "DELETE FROM favourite WHERE id = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT favourite.*, customers.username, customers.images FROM favourite JOIN post ON post.id = favourite.post_id JOIN customers ON favourite.customers_id = customers.id WHERE post_id = ${id}
ORDER BY date DESC;`;
      connect.query(sql, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
};
