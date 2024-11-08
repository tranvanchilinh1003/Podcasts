var connect = require("./database");
var Post = [];
module.exports = class Post {
  constructor() { }
  static fetchAll(from, row) {
    return new Promise((resolve, reject) => {
      connect.query(
        `SELECT post.*, 
    customers.images AS images_customers, 
    customers.username, 
    COUNT(DISTINCT comments.id) AS total_comments, 
    COUNT(DISTINCT \`like\`.id) AS total_favorites, 
    COUNT(DISTINCT share.id) AS total_shares 
FROM 
    post 
JOIN 
    customers ON post.customers_id = customers.id 
LEFT JOIN 
    comments ON post.id = comments.post_id 
LEFT JOIN 
  \`like\` ON post.id = \`like\`.post_id
LEFT JOIN 
    share ON post.id = share.post_id 
GROUP BY 
    post.id, 
    customers.images, 
    customers.username
ORDER BY 
    post.create_date DESC LIMIT ?,?`,
        [from, row],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  static async getPostClient() {
    return new Promise((resolve, reject) => {
      connect.query(
        "SELECT post.*, customers.images AS images_customers, customers.username, COUNT(DISTINCT comments.id) AS total_comments, COUNT(DISTINCT favourite.id) AS total_favorites, COUNT(DISTINCT share.id) AS total_shares FROM post JOIN customers ON post.customers_id = customers.id LEFT JOIN comments ON post.id = comments.post_id LEFT JOIN favourite ON post.id = favourite.post_id LEFT JOIN share ON post.id = share.post_id GROUP BY post.id ORDER BY view DESC LIMIT 6;",
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        }
      );
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
      let sql = `SELECT post.*, categories.id AS categories_id, categories.name AS category_name, customers.id AS customers_id, customers.username, customers.images AS images_customers, customers.isticket,COUNT(DISTINCT comments.id) AS total_comments, COUNT(DISTINCT \`like\`.id) AS total_likes FROM post JOIN categories ON post.categories_id = categories.id JOIN customers ON post.customers_id = customers.id LEFT JOIN comments ON post.id = comments.post_id LEFT JOIN \`like\` ON post.id = \`like\`.post_id WHERE post.id = ${postId} GROUP BY post.id, categories.id, customers.id;`;
      connect.query(sql, [postId], function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  static async postCustomerId(id) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT 
    post.*, 
    customers.images AS images_customers, 
    customers.username, 
    COUNT(DISTINCT comments.id) AS total_comments, 
    COUNT(DISTINCT \`like\`.id) AS total_likes, 
    COUNT(DISTINCT share.id) AS total_shares 
FROM 
    post 
JOIN 
    customers ON post.customers_id = customers.id 
LEFT JOIN 
    comments ON post.id = comments.post_id 
LEFT JOIN 
    \`like\` ON post.id = \`like\`.post_id 
LEFT JOIN 
    share ON post.id = share.post_id 
WHERE 
    post.customers_id = ${id}
GROUP BY 
    post.id, customers.images, customers.username 
ORDER BY 
    post.create_date DESC;
`;
      connect.query(sql, [id], function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  static async getIdPost(postId) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT 
    p.*, 
    c.images AS images_customers,
    c.username,
    c.isticket,
    COUNT(DISTINCT cm.id) AS total_comments,
    COUNT(DISTINCT s.id) AS total_shares,
    COUNT(DISTINCT l.id) AS total_likes,
    COALESCE(AVG(cm.rating), 0) AS average_comment_rating
FROM 
    post AS p
JOIN 
    customers AS c ON p.customers_id = c.id
LEFT JOIN 
    comments AS cm ON p.id = cm.post_id
LEFT JOIN 
    share AS s ON p.id = s.post_id
LEFT JOIN
    \`like\` AS l ON p.id = l.post_id
  
WHERE p.id = ${postId}

ORDER BY 
    p.create_date DESC
    `;
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
      let sql = `
             SELECT 
    p.*, 
    c.images AS images_customers,
    c.username,
    c.isticket,
    COUNT(DISTINCT cm.id) AS total_comments,
    COUNT(DISTINCT s.id) AS total_shares,
    COUNT(DISTINCT l.id) AS total_likes,
    COALESCE(AVG(cm.rating), 0) AS average_comment_rating
FROM 
    post AS p
JOIN 
    customers AS c ON p.customers_id = c.id
LEFT JOIN 
    comments AS cm ON p.id = cm.post_id
LEFT JOIN 
    share AS s ON p.id = s.post_id
LEFT JOIN
    \`like\` AS l ON p.id = l.post_id

GROUP BY 
    p.id, p.title, p.images, p.audio, p.description, p.categories_id, p.customers_id, p.view, p.create_date, p.update_date, 
    c.images, c.username, c.isticket
ORDER BY 
    p.create_date DESC;
        `;

      connect.query(sql, function (err, data) {
        if (err) {
          console.error("SQL Error:", err); // In lỗi ra console
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
            reject(
              "Không thể xóa bài đăng vì có bài comment trong bài đăng này."
            ); // Nếu không có hàng nào bị ảnh hưởng, trả về thông báo lỗi
          }
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
      let sql = `SELECT DISTINCT images,  title, id FROM post WHERE LOWER(title) LIKE ?`;
      connect.query(sql, [`%${key}%`], function (err, data) {
        if (err) {
          reject(err);
        } else {
          const suggestions = data.map((item) => ({
            title: item.title,
            images: item.images,
            id: item.id,
          }));
          resolve(suggestions);
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

  static async getData(startDate, endDate) {
    // Truy vấn SQL sử dụng ngày đã được format với `DATE_FORMAT`
    const sql = `
        SELECT 
            DATE_FORMAT(p.create_date, '%Y-%m-%d') AS day, 
            p.title,
            c.username,
            SUM(p.view) AS total_views
        FROM post p
        JOIN customers c ON p.customers_id = c.id
        WHERE p.create_date BETWEEN ? AND ? 
        GROUP BY day, p.title, c.username
        ORDER BY total_views DESC
        LIMIT 5;
    `;

    return new Promise((resolve, reject) => {
        // Thực hiện truy vấn với tham số startDate và endDate đã được truyền vào
        connect.query(sql, [startDate, endDate], (err, results) => {
            if (err) {
                // Log lỗi và trả về lời hứa bị từ chối
                console.error("Database error:", err);
                reject(err);
            } else {
                
                resolve(results);
            }
        });
    });
}


  static async getChart() {
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
