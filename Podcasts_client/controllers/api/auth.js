const Customers = require("../../models/customers");
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const authToken = require('../../middlewares/authToken');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const nodemailer = require("nodemailer");
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
                    return res.status(200).json({ data: result, success: true, message: 'Đăng nhập thành công (user)', token });
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

function sendEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'foodcast440@gmail.com', 
      pass: 'clnj hmwa zwfh gfcl', 
    },
  });

  async function main() {
    const mailOptions = {
      from: '"Foodcast Forum" <foodcast440@gmail.com>', // Địa chỉ người gửi
      to: email, 
      subject: "Foodcast Forum Gửi Mã OTP", // Chủ đề email
      text: `Mã OTP của bạn là: ${otp}`, // Nội dung văn bản
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 10px;">
          <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F2024-06-14T06%3A19%3A57.176Z.png?alt=media&token=c0c732ae-a0af-4b05-b87a-e4dacc7a8c82" alt="Foodcast Forum Logo" style="max-width: 100px;">
          <h2 style="color: #333;">Xác nhận Email của bạn</h2>
          <p style="color: #666;">Mã OTP của bạn là:</p>
          <h1 style="background-color: #007bff; color: #fff; padding: 10px; border-radius: 5px; margin: 20px 0;">${otp}</h1>
          <p style="color: #666;">Vui lòng sử dụng mã này để hoàn thành thao tác xác thực.</p>
        </div>
        <p style="text-align: center; margin-top: 20px; color: #888;">Đây là email tự động, vui lòng không phản hồi.</p>
      </div>
    `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending email: %s", error);
      return { success: false, error: error };
    }
  }

  main().catch(console.error);
}



exports.forgotPassword = async (req, res, next) => {
    const email = req.body.email;
    const otp = Math.floor(10000 + Math.random() * 90000);
    try {
        const result = await Customers.forgotPassword(email, otp);
        if (result.affectedRows > 0) {
            // Gửi OTP đến email của người dùng ở đây
            // Có thể sử dụng thư viện như nodemailer để gửi email
            // Ví dụ: sendEmail(email, 'OTP: ' + otp);
            sendEmail(email, otp)
            // Trong trường hợp này, bạn không cần kiểm tra role, vì chỉ cập nhật OTP
            return res.status(200).json({data: email,  success: true, message: 'OTP đã được gửi đến email của bạn.' });
        } else {
            return res.status(404).json({ success: false, message: 'Email không tồn tại' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi' });
    }
};




exports.otp = async (req, res, next) => {
    try {
        const otp = req.body.otp;
        const email = req.body.email;
        const result = await Customers.OTP(email, otp);
        if (result.length > 0) {
            return res.status(200).json({ success: true, message: 'OTP Đúng' });
        } else {
            return res.status(404).json({ success: false, message: 'Sai OTP' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};
exports.changePassword = async (req, res, next) => {
    try {
        const password = await bcrypt.hash((req.body.password), 10)
        const email = req.body.email;
        const result = await Customers.changePassword(password, email);
        return res.status(200).json({ success: true, message: 'Cập nhật thành công'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

