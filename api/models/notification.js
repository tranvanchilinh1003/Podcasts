var connect = require("./database");

module.exports = class Notification {
    constructor() {}
        static CreateNotification(user_id, sender_id, action, post_id) {
            return new Promise((resolve, reject) => {
                const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
                if (action === 'like') {
                    connect.query(
                        "INSERT INTO notifications (user_id, sender_id, type, post_id, created_at) VALUES (?, ?, ?, ?, ?)",
                        [user_id, sender_id, action, post_id, currentDate],
                        (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                } else if (action === 'follow') {
                    connect.query(
                        "INSERT INTO notifications (user_id, sender_id, type, created_at) VALUES (?, ?, ?, ?)",
                        [user_id, sender_id, action, currentDate],
                        (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                } else {
                    // Nếu action không hợp lệ
                    reject(new Error('Invalid action'));
                }
            });
        }


static getByUserId(user_id) {
    return new Promise((resolve, reject) => {
        connect.query(
            "SELECT n.*, c.username, c.images FROM notifications n JOIN customers c ON n.sender_id = c.id WHERE n.user_id = ? ORDER BY n.created_at DESC;", 
            [user_id],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
}
static deleteNotification(id) {
    return new Promise((resolve, reject) => {
      connect.query(
        "DELETE FROM notifications WHERE id = ?",
        [id],
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

  static updateNotification( id) {
    return new Promise((resolve, reject) => {
        connect.query(`UPDATE notifications SET isread= 'inactive' WHERE id = ?`, [ id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        });
    });
}

}
