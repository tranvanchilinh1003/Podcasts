const Customers = require("../../models/customers");
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const moment = require('moment-timezone');
exports.list = async (req, res, next) => {
    try {
    const page = req.query.page || 1;
    const row = 5; 
    const from = (page - 1) * row;
    const totalProducts = await Customers.coutCustomers(); 
    if(totalProducts > 0) {

    
    const totalPages = Math.ceil(totalProducts / row);
    const customers = await Customers.fetchAll(from, row);
        res.status(200).json({
            data: customers,
            meta: {
                current_page: page,
                last_page: totalPages,
                from: from,
                count: totalProducts
            }
        });
    }else{
        res.status(200).json({
            data: customers,
            meta: {
                current_page: page,
                last_page: 1,
                from: from
            }
        })
    }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.create = async (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    try {
        let existingUser = await Customers.findUser(username, email);

        if (existingUser.length > 0) {
        return  res.status(400).json({ error: "Username hoặc email đã tồn tại." });
        }
        const date_create = moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss');
        const hashedPassword = await bcrypt.hash(password, 10); 
        const customers = {
            username: username,
            full_name: req.body.full_name,
            password: hashedPassword,
            email: email,
            role: req.body.role,
            gender: req.body.gender,
            images: req.body.images,
            isticket: req.body.isticket,
            date: date_create
        };

        const addedCustomers = await Customers.createCustomers(customers);
        res.status(200).json({
            data: addedCustomers,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "Đã xảy ra lỗi khi tạo người dùng. "+ error.message,
        });
    }
};


exports.login = async (req, res, next) => {
    try {
        let username = req.body.username;
        let password = req.body.password;


        let result = await Customers.login(username);

        if (result.length > 0) {
            let hashPasswordDB = result[0].password;

            let match = await bcrypt.compare(password, hashPasswordDB);

            if (match) {
                res.status(200).json({
                    status: 1,
                    data: result,
                });
            } else {
                res.status(401).json({
                    status: 0,
                    message: "Mật khẩu không hợp lệ.",
                });
            }
            
        } else {
            res.status(404).json({
                status: 0,
                message: "Không tìm thấy người dùng.",
            });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            status: 0,
            message: "Đã xảy ra lỗi không mong muốn.",
        });
    }
};

exports.detail = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Customers.getUpdateCustomers(id);

        res.status(201).json({
            data: result,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};




exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const currentCustomer = await Customers.getUpdateCustomers(id);

        if (!currentCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        let hashedPassword = req.body.password;

        if (req.body.password && !req.body.password.startsWith("$2b$10$")) {
            hashedPassword = await bcrypt.hash(req.body.password, 10);
        }

        const customers = {
            username: req.body.username,
            full_name: req.body.full_name,
            password: hashedPassword,
            email: req.body.email,
            role: req.body.role,
            gender: req.body.gender,
            images: req.body.images,
            isticket: req.body.isticket,
        };

        const result = await Customers.updateCustomers(customers, id);

        res.status(201).json({
            result: result,
            data: customers
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};



exports.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Customers.deleteCustomers(id);

        res.status(201).json({
            result: result
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.search = async (req, res, next) => {    
    const key = req.query.messages; 
    try {
        const posts = await Customers.search(key);
        res.status(200).json({
            data: posts 
        });
    } catch (error) {
        console.error("Error searching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.suggestKeywords = async (req, res, next) => {    
    let key = req.query.keyword.toLowerCase();
    try {
        const keywords = await Customers.suggestCustomerKeywords(key);
        res.status(200).json({
            data: keywords
        });
    } catch (error) {
        console.error("Error suggesting keywords:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.chart = async (req, res, next) => {    
    try {
        const customerStats = await Customers.getData(); 
        res.json(customerStats);
      } catch (error) {
        console.error('Error fetching customer stats:', error);
        res.status(500).json({ error: 'Error fetching customer stats' });
      }
    }
 