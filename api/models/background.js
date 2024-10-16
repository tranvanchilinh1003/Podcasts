var connect = require("./database");

module.exports = class Background {
    constructor() { }
    static updateCustomers(customers, customersId) {
        return new Promise((resolve, reject) => {
            const { images, background } = customers; // Destructure to get only the fields we want to update

            connect.query(
                `UPDATE customers SET images = ?, background = ? WHERE id = ?`,
                [images, background, customersId],
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
}