var connect = require("./database");

module.exports = class Custumets {
  constructor() {}
 

  static async getALLCustumers() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM customers`;
      connect.query(sql, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  static async Delete(id) {
    return new Promise((resolve, reject) => {
      let sql = `DELETE FROM customers WHERE id=${id} `;
      connect.query(sql, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
 
  static async login(username) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM customers WHERE username = '${username}' `;
      connect.query(sql, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  static async forgotPassword(email, otp) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE customers SET otp = '${otp}' WHERE email = '${email}'`;
        connect.query(sql, function (err, data) {
            if (err) {
                reject(err);
            } else {
                if (data.affectedRows > 0) {
                    resolve(data);
                } else {
                    reject(new Error('Email không tồn tại'));
                }
            }
        });
    });
}
static async OTP(email, otp) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM customers WHERE email = ? AND otp = ?`;
    connect.query(sql, [email, otp], function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
static async changePassword(password, email) {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE customers SET password = ? WHERE email = ?`;
    connect.query(sql, [password,email], function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

};
