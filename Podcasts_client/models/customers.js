
var connect = require('./database');

module.exports = class Customers {
    constructor() { }
    static fetchAll(from, row) {
      return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM customers LIMIT ?,?`;
        connect.query(sql, [from, row], function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
    static async findUser(username, email) {
      return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM customers WHERE username = ? OR email = ?';
          connect.query(query, [username, email], (err, results) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(results);
              }
          });
      });
  }
    static async coutCustomers() {
      return new Promise((resolve, reject) => {
        let sql = `SELECT COUNT(*) AS count FROM customers`; 
        connect.query(sql, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data[0].count);
          }
        });
      });
  }
    static createCustomers(customers) {
        return new Promise((resolve, reject) => {
            connect.query("INSERT INTO customers SET ?", customers, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }

            });
        });
    }

    static getUpdateCustomers(customersId) {
        return new Promise((resolve, reject) => {
            connect.query(`SELECT * FROM customers WHERE id = ${customersId}`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }

            });
        });
    }

    static updateCustomers(customers, customersId) {
        return new Promise((resolve, reject) => {
            connect.query(`UPDATE customers SET ? WHERE id = ?`, [customers, customersId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
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
    

    static async search(key) {
      return new Promise((resolve, reject) => {
        let sql = `SELECT customers.* FROM customers WHERE LOWER(customers.username) LIKE ? OR LOWER(customers.full_name) LIKE ?`;
        connect.query(sql, [`%${key}%`, `%${key}%`], function (err, data) {
          if (err) {
            reject(err);
          } else {
            const keywords = data.map((item) => item.username); 
            resolve({ data, keywords });
          }
        });
      });
    }
    

    static async suggestCustomerKeywords(key) {
      return new Promise((resolve, reject) => {
        let sql = `SELECT DISTINCT username, full_name FROM customers WHERE LOWER(username) LIKE ? `;
        connect.query(sql, [`%${key}%`], function (err, data) {
          if (err) {
            reject(err);
          } else {
            const usernames = data.map((item) => item.username);
            resolve([...usernames]);
          }
        });
      });
    }
    


    

static async getData() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        MONTH(date) AS month,
        COUNT(*) AS customer_count
      FROM customers
      GROUP BY MONTH(date)
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
