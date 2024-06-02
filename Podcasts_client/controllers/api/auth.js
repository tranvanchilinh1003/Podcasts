const Customers = require("../../models/customers");
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const authToken = require('../../middlewares/authToken');
app.use(express.json());


const secretKey = 'token';
let revokedTokens = [];

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await Customers.login(username);
        if (result.length > 0) {
            const match = await bcrypt.compare(password, result[0].password);
            if (match) {
                const payload = { username: result[0].username, role: result[0].role, id: result[0].id };
                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

                if (result[0].role === 'user') {
                    return res.status(200).json({ success: true, message: 'Đăng nhập thành công (user)', token });
                } else if (result[0].role === 'admin') {
                    return res.status(200).json({ data: result, token, success: true, message: 'Đăng nhập thành công (admin)' });
                }
            } else {
                return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác' });
            }
        } else {
            return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
        }
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi' });
    }
};

exports.logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
            } else {
                revokedTokens.push(token);
                return res.status(200).json({ success: true, message: 'Đăng xuất thành công!' });
            }
        });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi' });
    }
};
const checkRevokedToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (revokedTokens.includes(token)) {
        return res.status(401).json({ success: false, message: 'Token đã bị thu hồi' });
    }
    next();
};