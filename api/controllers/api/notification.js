const Notification  = require('../../models/notification'); 
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const moment = require('moment-timezone');
const nodemailer = require("nodemailer");

exports.Createnotification = async (req, res, next) => {
    const { user_id, sender_id, action, post_id } = req.body;
  
    try {
        const result = await Notification.CreateNotification(user_id, sender_id, action, post_id);
        res.status(201).json({
            data: result,
            notification_id: result.insertId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
  };
exports.getList = async (req, res, next) => {
    const id = req.params.id;

    try {
        const notifications = await Notification.getByUserId(id); 
        res.status(200).json({ data: notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
  };

  exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Notification.deleteNotification(id);
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Notification not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
exports.update = async (req, res, next) => {
    let id = req.params.id;
    
    let result = await Notification.updateNotification(id);
    res.status(201).json({
        data: result

    })
};
exports.notify = async (req, res, next) => {
    const { email, message } = req.body; 

    const result = await sendEmail(email, message); 
};





function sendEmail(to, message) {
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
            to: to,
            subject: `CuisinePodcast thân gửi đến ${to}`, // Chủ đề email
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #ff920df6; color: #fff; padding: 20px; text-align: center;">
                        <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2FlogoCuisine-removebg-preview.png?alt=media&token=7e17d9ca-3639-4b8c-88d7-3ded37f039c5" alt="Cuisine Podcasts Logo" style="max-width: 120px; border-radius: 50%;">
                        <h1 style="margin: 10px 0;">Cuisine Podcasts!</h1>
                    </div>
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <h2 style="color: #333; margin-top: 0;">Thông báo từ Cuisine Podcasts</h2>
                        <p style="color: #666;">${message}</p>
                    
                    </div>
                    <div style="background-color: #333; color: #fff; padding: 10px; text-align: center;">
                        <p style="margin: 0;">Đây là email tự động, vui lòng không phản hồi.</p>
                        <p style="margin: 0;">© 2024 Cuisine Podcasts. All rights reserved.</p>
                    </div>
                </div>
            `, // Sử dụng HTML cho nội dung
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

