var connect = require("./database");

module.exports = class Follow {
    constructor() {}

    static createFollow(follow) {
        return new Promise((resolve, reject) => {
            connect.query("INSERT INTO follow SET ?", follow, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static removeFollow(followerId, followedId) {
        return new Promise((resolve, reject) => {
            connect.query(
                "DELETE FROM follow WHERE follower_id = ? AND followed_id = ?",
                [followerId, followedId],
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

    static checkFollow(followedId, followerId) {
        return new Promise((resolve, reject) => {
            connect.query(
                "SELECT COUNT(*) AS count FROM follow WHERE followed_id = ? AND follower_id = ?",
                [followedId, followerId], 
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
    static checkLike(customer_id) {
        return new Promise((resolve, reject) => {
            connect.query(
                "SELECT post_id  FROM \`like\`   WHERE customers_id = ? ",
                [customer_id], 
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
    static deleteLike(post_id, customers_id) {
        return new Promise((resolve, reject) => {
            connect.query(
                "DELETE FROM `like` WHERE post_id = ? AND customers_id = ?",
                [post_id, customers_id], 
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
    static addLike(post_id, customers_id) {
        return new Promise((resolve, reject) => {
            connect.query(
                "INSERT INTO `like` (post_id, customers_id) VALUES (?, ?)",
                [post_id, customers_id], 
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
    static list_follow(id) {
        return new Promise((resolve, reject) => {
            connect.query(
                "SELECT u.id, u.username, f.follow_date, u.images, u.email FROM follow f JOIN customers u ON f.follower_id = u.id WHERE f.followed_id = ?",
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
    
};
