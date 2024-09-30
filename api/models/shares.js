var connect = require('./database');
var shares = [];
module.exports = class Shares {
    constructor() { }

    static fetchAll(id, from, row) {
        return new Promise((resolve, reject) => {
            connect.query(`
            SELECT 
    sh.id, 
    p.id AS post_id, 
    p.title, 
    p.description, 
    p.images AS post_images, 
    p.audio, 
    p.create_date, 
    p.customers_id AS post_customer_id, 
    COUNT(sh.id) AS so_luong, 
    MIN(sh.date) AS cu_nhat, 
    MAX(sh.date) AS moi_nhat, 
    c.username AS sharing_customer_username, 
    c.images AS sharing_customer_image, 
    c2.username AS post_customer_username, 
    c2.images AS post_customer_image, 
    COUNT(com.id) AS comment_count,
    COUNT(DISTINCT \`like\`.id) AS total_likes,  
    COUNT(DISTINCT sh.id) AS total_shares  
FROM 
    SHARE sh 
JOIN 
    post p ON p.id = sh.post_id 
JOIN 
    customers c ON c.id = sh.customers_id 
JOIN 
    customers c2 ON c2.id = p.customers_id 
LEFT JOIN 
    comments com ON com.post_id = p.id 
LEFT JOIN 
    \`like\` ON p.id = \`like\`.post_id  
WHERE 
    c.id = ? 
GROUP BY 
    sh.id, 
    p.id, 
    p.title, 
    p.description, 
    p.images, 
    p.audio, 
    p.create_date, 
    p.customers_id, 
    c.username, 
    c.images, 
    c2.username, 
    c2.images 
HAVING 
    so_luong > 0 
ORDER BY 
    moi_nhat DESC;

    ;

`, [id, from, row], (err, result) => {
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


    static createShare(postId, customerId) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO share (post_id, customers_id, date) VALUES (?, ?, NOW())';
            connect.query(query, [postId, customerId], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }


    static delete(id) {
        return new Promise((resolve, reject) => {
            connect.query(`DELETE FROM share WHERE id = ${id}`, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    
}