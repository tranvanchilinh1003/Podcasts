const db = require("./database"); // Kết nối cơ sở dữ liệu

class RepComment {
  static create(newRepComment, callback) {
    const {
      contents,
      date,
      customers_id,
      original_comment_id,
      parent_reply_id,
    } = newRepComment;

    let level = 0;

    if (parent_reply_id) {
      const query = `
                WITH RECURSIVE reply_tree AS (
                    SELECT id, level
                    FROM repcomments
                    WHERE id = ?
                    UNION ALL
                    SELECT r.id, r.level
                    FROM repcomments r
                    INNER JOIN reply_tree rt ON r.parent_reply_id = rt.id
                )
                SELECT level
                FROM reply_tree
                ORDER BY level DESC
                LIMIT 1
            `;

      db.query(query, [parent_reply_id], (err, result) => {
        if (err) {
          return callback(err);
        }

        if (result.length > 0) {
          level = result[0].level + 1;
        }

        const insertQuery = `INSERT INTO repcomments (contents, date, customers_id, original_comment_id, parent_reply_id, level) 
                                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(
          insertQuery,
          [
            contents,
            date,
            customers_id,
            original_comment_id,
            parent_reply_id,
            level,
          ],
          callback
        );
      });
    } else {
      level = 0;
      const insertQuery = `INSERT INTO repcomments (contents, date, customers_id, original_comment_id, parent_reply_id, level) 
                                 VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(
        insertQuery,
        [
          contents,
          date,
          customers_id,
          original_comment_id,
          parent_reply_id,
          level,
        ],
        callback
      );
    }
  }

  static findByCommentId(commentId, callback) {
    const query = `
        WITH RECURSIVE reply_tree AS (
            SELECT 
                r.id, 
                r.contents, 
                r.date, 
                r.customers_id, 
                r.original_comment_id, 
                r.parent_reply_id, 
                r.level,
                c.username,
                c.images
            FROM repcomments r
            JOIN customers c ON r.customers_id = c.id
            WHERE r.original_comment_id = ? AND r.parent_reply_id IS NULL

            UNION ALL

            SELECT 
                r.id, 
                r.contents, 
                r.date, 
                r.customers_id, 
                r.original_comment_id, 
                r.parent_reply_id, 
                r.level,
                c.username,
                c.images
            FROM repcomments r
            JOIN customers c ON r.customers_id = c.id
            INNER JOIN reply_tree rt ON r.parent_reply_id = rt.id
        )
        SELECT * FROM reply_tree ORDER BY level, date ASC;
    `;
    db.query(query, [commentId], callback);
  }

  
  static findAllReplies(callback) {
    const query = `
            WITH RECURSIVE reply_tree AS (
                SELECT r.id, r.contents, r.date, r.customers_id, r.original_comment_id, r.parent_reply_id, r.level
                FROM repcomments r
                WHERE r.parent_reply_id IS NULL
                UNION ALL
                SELECT r.id, r.contents, r.date, r.customers_id, r.original_comment_id, r.parent_reply_id, r.level
                FROM repcomments r
                INNER JOIN reply_tree rt ON r.parent_reply_id = rt.id
            )
            SELECT rt.*, c.username, c.images
            FROM reply_tree rt
            LEFT JOIN customers c ON rt.customers_id = c.id
            ORDER BY rt.level, rt.date ASC
        `;
    db.query(query, callback);
  }

  static deleteById(id, callback) {
    const query = `DELETE FROM repcomments WHERE id = ?`;
    db.query(query, [id], callback);
  }

  static updateById(id, updatedContent, callback) {
    const query = `UPDATE repcomments SET contents = ? WHERE id = ?`;
    db.query(query, [updatedContent, id], callback);
  }
}

module.exports = RepComment;
