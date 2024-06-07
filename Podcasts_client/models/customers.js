
var connect = require('./database');

module.exports = class Customers {
    constructor() {}
    static fetchAll() {
        return new Promise((resolve, reject) => {
            connect.query('SELECT * FROM customers', (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static createCustomers(customers) {
        return new Promise((resolve, reject) => {
            connect.query("INSERT INTO customers SET ?", customers, (err, result) => {
                if (err){
                    reject(err);                  
                } else{
                    resolve(result);
                }
               
            });
        });
    }

    static getUpdateCustomers(customersId) {
        return new Promise((resolve, reject) => {
            connect.query(`SELECT * FROM customers WHERE id = ${customersId}`, (err, result) => {
                if (err){
                    reject(err);                  
                } else{
                    resolve(result);
                }
               
            });
        });
    }

    static updateCustomers(customers,customersId) {
        return new Promise((resolve, reject) => {
            connect.query(`UPDATE customers SET ? WHERE id = ?`, [customers, customersId], (err, result) => {
                if (err){
                    reject(err);                  
                } else{
                    resolve(result);
                }
               
            });
        });
    }

    static deleteCustomers(customersId) {
        return new Promise((resolve, reject) => {
            connect.query(
            'DELETE FROM customers WHERE id = ?',
            [customersId],
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