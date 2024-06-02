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
};
