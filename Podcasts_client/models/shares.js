var connect = require('./database');
var shares = [];
module.exports = class Shares {
    constructor() { }
    static fetchAll() {
        return new Promise((resolve, reject) => {
            connect.query('SELECT sh.id, p.id AS post_id, p.title, p.images, COUNT(*) AS so_luong, MIN(sh.date) AS cu_nhat, MAX(sh.date) AS moi_nhat, c.username FROM share sh JOIN post p ON p.id = sh.post_id JOIN customers c ON c.id = sh.customers_id GROUP BY sh.id, p.id, p.title, c.username HAVING so_luong > 0; ', (err, result) => {
                if (err) reject(err);
                resolve(result);
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