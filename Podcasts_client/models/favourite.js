var connect = require('./database');
var favourite = [];
module.exports = class Favourite {
    constructor() {}
    static fetchAll() {
        return new Promise((resolve, reject) => {
            connect.query('SELECT fa.id, p.id AS post_id, p.title, p.images, COUNT(*) AS so_luong, MIN(fa.date) AS cu_nhat, MAX(fa.date) AS moi_nhat, c.username FROM favourite fa JOIN post p ON p.id = fa.post_id JOIN customers c ON c.id = fa.customers_id GROUP BY fa.id, p.id, p.title, c.username HAVING so_luong > 0;', (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
    static delete(id) {
        return new Promise((resolve, reject) => {
            connect.query('DELETE FROM favourite WHERE id = ?', [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}