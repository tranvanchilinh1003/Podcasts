
var connect = require('./database');

module.exports = class Customers {
    constructor() { }
    static fetchAll(from, row) {
      return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM customers ORDER By customers.create_date DESC LIMIT ?, ?`;
        connect.query(sql,[from, row],   function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
    static async findUser(username, email, excludeId = 0) {
      return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM customers WHERE (username = ? OR email = ?) AND id != ?';
          connect.query(query, [username, email, excludeId], (err, results) => {
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
          const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP hết hạn sau 5 phút
          let sql = `UPDATE customers SET otp = ?, otp_expires_at = ? WHERE email = ?`;
          connect.query(sql, [otp, expiresAt, email], function (err, data) {
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
          // Truy vấn để lấy OTP và thời gian hết hạn
          let sql = `SELECT otp, otp_expires_at FROM customers WHERE email = ?`;
          connect.query(sql, [email], function (err, data) {
            if (err) {
              reject(err);
            } else {
              if (data.length > 0) {
                const otpRecord = data[0];
                const now = new Date();

                const storedOtp = String(otpRecord.otp).trim();
                const inputOtp = String(otp).trim();

                if (storedOtp === inputOtp) {
                  if (new Date(otpRecord.otp_expires_at) > now) {
                    resolve({ success: true, message: 'OTP đúng' });
                  } else {
                    resolve({ success: false, message: 'OTP đã hết hạn' });
                  }
                } else {
                  resolve({ success: false, message: 'Sai OTP' });
                }
              } else {
                resolve({ success: false, message: 'Email không tồn tại' });
              }
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
    
    static async countByKey(key) {
      return new Promise((resolve, reject) => {
          let sql = `SELECT COUNT(*) AS count 
                     FROM customers
                     WHERE LOWER(customers.username) LIKE ? OR LOWER(customers.full_name) LIKE ?`;
  
          connect.query(sql, [`%${key}%`, `%${key}%`], (err, results) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(results[0].count);
              }
          });
      });
  }

    static async suggestCustomerKeywords(key) {
      return new Promise((resolve, reject) => {
        let sql = `SELECT DISTINCT images, username, full_name 
                       FROM customers 
                       WHERE LOWER(username) LIKE ? `;
        connect.query(sql, [`%${key}%`], function (err, data) {
          if (err) {
            reject(err);
          } else {
            const suggestions = data.map(item => ({
              username: item.username,
              images: item.images
          }));
           resolve(suggestions);
          }
        });
      });
    }
    



    

static async getData() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        MONTH(create_date) AS month,
        COUNT(*) AS customer_count
      FROM customers
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
static async CheckMail(email) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM customers WHERE email = ?';
      connect.query(query, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }  
      });
  });
}




};
