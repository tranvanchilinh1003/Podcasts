const Customers = require("../../models/customers");
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const moment = require('moment-timezone');
const nodemailer = require("nodemailer");
exports.list = async (req, res, next) => {
    try {
    const page = req.query.page || 1;
    const row = 5; 
    const from = (page - 1) * row;
    const totalProducts = await Customers.coutCustomers(); 
    if(totalProducts > 0) {

    
    const totalPages = Math.ceil(totalProducts / row);
    const customers = await Customers.fetchAll(from,row);
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
    let username = req.body.username.trim().toLowerCase();
    let email = req.body.email;
    let password = req.body.password;

    try {
        // Exclude ID is set to 0 by default for new users
        let existingUser = await Customers.findUser(username, email, 0);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Username hoặc email đã tồn tại." });
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
            create_date: date_create,
            background: req.body.background
        };

        const addedCustomers = await Customers.createCustomers(customers);
        sendEmail(customers.email)
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




// exports.update = async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const { username, email, full_name, role, gender, images, isticket, password, background } = req.body;

//         console.log('Updating customer:', { id, username, email, full_name, role, gender, images, isticket, password, background }); // Log dữ liệu nhận được

//         // Lấy thông tin khách hàng hiện tại từ cơ sở dữ liệu
//         const currentCustomer = await Customers.getUpdateCustomers(id);
//         if (!currentCustomer) {
//             return res.status(404).json({ error: 'Customer not found' });
//         }

//         const { username: oldUsername, email: oldEmail, password: oldPassword } = currentCustomer;

//         // Kiểm tra nếu username và email đã thay đổi
//         if (username !== oldUsername || email !== oldEmail) {
            
//             // Kiểm tra xem có tồn tại username hoặc email trùng lặp trong cơ sở dữ liệu, loại trừ khách hàng hiện tại
//             const existingUser = await Customers.findUser(username, email, id);

          
//             if (existingUser.length > 0) {
//                 return res.status(400).json({ error: 'Username hoặc email đã tồn tại.' });
//             }
//         }

//         // Xử lý mật khẩu
//         let hashedPassword = oldPassword; // Mặc định sử dụng mật khẩu cũ

//         if (password) {
//             // Nếu có mật khẩu mới và mật khẩu mới không phải là mật khẩu đã băm
//             if (!password.startsWith("$2b$10$")) {
//                 hashedPassword = await bcrypt.hash(password, 10);
//             } else {
//                 hashedPassword = password; // Nếu mật khẩu mới đã được băm, không thay đổi
//             }
//         }

//         const customers = {
//             username,
//             full_name,
//             email,
//             role,
//             gender,
//             images,
//             background,
//             isticket,
//             password: hashedPassword // Cập nhật mật khẩu mới hoặc giữ mật khẩu cũ
//         };

        

//         const result = await Customers.updateCustomers(customers, id);

//         res.status(200).json({
//             result,
//             data: customers
//         });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({
//             error: 'Internal Server Error'
//         });
//     }
// };

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { username, email, full_name, role, gender, images, isticket, password, background } = req.body;

        console.log('Updating customer:', { id, username, email, full_name, role, gender, images, isticket, password, background });

        // Fetch the current customer information from the database
        const currentCustomer = await Customers.getUpdateCustomers(id);
        if (!currentCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const { username: oldUsername, email: oldEmail, password: oldPassword, background: oldBackground } = currentCustomer;

        // Check if username and email have changed
        if (username !== oldUsername || email !== oldEmail) {
            // Check for existing username or email in the database, excluding the current customer
            const existingUser = await Customers.findUser(username, email, id);

            if (existingUser.length > 0) {
                return res.status(400).json({ error: 'Username hoặc email đã tồn tại.' });
            }
        }

        // Handle password
        let hashedPassword = oldPassword; // Default to the old password

        if (password) {
            // If there is a new password and it's not already hashed
            if (!password.startsWith("$2b$10$")) {
                hashedPassword = await bcrypt.hash(password, 10);
            } else {
                hashedPassword = password; // If the new password is already hashed, keep it
            }
        }

        // Prepare the customer data for update
        const customers = {
            username,
            full_name,
            email,
            role,
            gender,
            images,
            background: background || oldBackground, // Use the new background if provided, else keep the old one
            isticket,
            password: hashedPassword // Update password or keep the old one
        };

        const result = await Customers.updateCustomers(customers, id);

        res.status(200).json({
            result,
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

        res.status(200).json({
            result: result
        });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({
                error: 'Cannot delete or update a parent row: a foreign key constraint fails.'
            });
        } else {
            console.error("Error:", error);
            res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }
};

exports.search = async (req, res, next) => {    
    const key = req.query.messages; 
    const page = parseInt(req.query.page, 10) || 1; 
    const row = 5;
    const from = (page - 1) * row
    try {
        const totalProducts = await Customers.countByKey({ key });
        const posts = await Customers.search(key);
        const totalPages = Math.ceil(totalProducts / row);
        if(totalProducts > 0){ 
        res.status(200).json({
            data: posts,
            meta: {
                current_page: page,
                last_page: totalPages,
                from: from,
                count: totalProducts
            }
        });
    }else {
        res.status(200).json({
            data: posts,
            meta: {
                current_page: page,
                last_page: 1,
                from: from,
                count: totalProducts
            }
        });
    }
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
 
    function sendEmail(email) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'foodcast440@gmail.com', 
                pass: 'clnj hmwa zwfh gfcl', 
            },
        });
    
        async function main() {
            const mailOptions = {
                from: '"Cuisine Podcasts" <foodcast440@gmail.com>', // Địa chỉ người gửi
                to: email, 
                subject: "Chào mừng bạn đã đăng ký thành công", // Chủ đề email
                text: "Chào mừng bạn đã đăng ký thành công tài khoản Cuisine Podcasts!", // Nội dung văn bản
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #007bff; color: #fff; padding: 20px; text-align: center;">
                        <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2Ficon.png?alt=media&token=a5846c3a-f685-4365-a3d7-9a1e8152f14e" alt="Cuisine Podcasts Logo" style="max-width: 120px; border-radius: 50%;">
                        <h1 style="margin: 10px 0;">Chào mừng đến với Cuisine Podcasts!</h1>
                    </div>
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <h2 style="color: #333; margin-top: 0;">Chúng tôi rất vui khi có bạn!</h2>
                        <p style="color: #666;">Cảm ơn bạn đã đăng ký tài khoản với Cuisine Podcasts. Chúng tôi rất vui khi có bạn tham gia cộng đồng của chúng tôi.</p>
                        <p style="color: #666;">Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.</p>
                    </div>
                    <div style="background-color: #333; color: #fff; padding: 10px; text-align: center;">
                        <p style="margin: 0;">Đây là email tự động, vui lòng không phản hồi.</p>
                        <p style="margin: 0;">© 2024 Cuisine Podcasts. All rights reserved.</p>
                    </div>
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




    