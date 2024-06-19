const axios = require("axios");
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const Post = require("../../models/post");
const app = express();
app.use(express.json());
const nodemailer = require("nodemailer");
const API_URL = "http://localhost:3000/api";

exports.homeClient = async (req, res, next) => {
  let userId = req.session.userId;
  let info = null;

  if (typeof userId !== "undefined") {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      info = response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  try {
    const [categoriesResponse, postsResponse] = await Promise.all([
      axios.get(`${API_URL}/categories/`),
      axios.get(`${API_URL}/post_home_client`),
    ]);
    const categoriesData = categoriesResponse.data;
    const postsData = postsResponse.data;

    res.render("client/index", {
      categories: categoriesData.data,
      posts: postsData.data,
      user: info,
      userId: userId,
    });
  } catch (error) {
    console.error("Error:", error);
    res.render("client/index", {
      categories: [],
      posts: [],
      user: info,
      userId: userId,
    });
  }
};

exports.getAbout = async (req, res, next) => {
  let userId = req.session.userId;
  let info = null;

  if (typeof userId !== "undefined") {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      info = response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  try {
    const categoriesResponse = await axios.get(`${API_URL}/categories/`);
    const categoriesData = categoriesResponse.data;
    res.render("client/about", {
      categories: categoriesData.data,
      user: info,
      userId: userId,
    });
  } catch (error) {
    console.error("ERR", error);
    res.render("client/about", {
      categories: [],
      user: info,
      userId: userId,
    });
  }
};

exports.getContact = async (req, res, next) => {
  let userId = req.session.userId;
  let info = null;

  if (typeof userId !== "undefined") {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      info = response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  try {
    const categoriesResponse = await axios.get(`${API_URL}/categories/`);
    const categoriesData = categoriesResponse.data;
    res.render("client/contact", {
      categories: categoriesData.data,
      user: info,
      userId: userId,
    });
  } catch (error) {
    console.error("ERR", error);
    res.render("client/contact", {
      categories: [],
      user: info,
      userId: userId,
    });
  }
};
exports.getPostAll = async (req, res, next) => {
  let userId = req.session.userId;
  let info = null;

  if (typeof userId !== "undefined") {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      info = response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  try {
    const [categoriesResponse] = await Promise.all([
      axios.get(`${API_URL}/categories/`),
    ]);
    const page = req.query.page || 1;
    const row = 9;
    const from = (page - 1) * row;
    const totalProducts = await Post.coutCustomers();
    const totalPages = Math.ceil(totalProducts / row);
    var post = await Post.getAllPost(from, row);
    const categoriesData = categoriesResponse.data;

    res.render("client/menu/product-all", {
      current_page: page,
      last_page: totalPages,
      categories: categoriesData.data,
      post_cate: post,
      message: "Không có bài đăng nào cho thể loại này!",
      user: info,
      userId: userId,
    });
  } catch (error) {
    console.error("ERR", error);
    res.render("client/product-all", {
      categories: [],
      post_cate: [],
      user: info,
      userId: userId,
    });
  }
};
exports.getMenu = async (req, res, next) => {
  let userId = req.session.userId;
  let info = null;

  if (typeof userId !== "undefined") {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      info = response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  try {
    const [categoriesResponse, posts_cateResponse] = await Promise.all([
      axios.get(`${API_URL}/categories/`),
      axios.get(`${API_URL}/product/${req.params.id}`),
    ]);
    const categoriesData = categoriesResponse.data;
    const post_categoriesData = posts_cateResponse.data;
    res.render("client/menu/product", {
      categories: categoriesData.data,
      post_cate: post_categoriesData.data,
      message: "Không tìm thấy bài đăng nào với thể loại này",
      user: info,
      userId: userId,
    });
  } catch (error) {
    console.error("ERR", error);
    res.render("client/product", {
      categories: [],
      post_cate: [],
      user: info,
      userId: userId,
    });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Lỗi khi đăng xuất:", err);
      res.status(500).send("Đã xảy ra lỗi khi đăng xuất");
    } else {
      res.redirect("/client/form/login");
    }
  });
};


exports.messege = async (req, res, next) => {
  
  try {
  const email = req.body.email;
  const full_name = req.body.full_name;
  const message = req.body.message;
  sendEmail(email, full_name, message)
    res.redirect("/client/contact");
  } catch (error) {
    console.error("ERR", error);
    
    }
};

function sendEmail(email, full_name, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'foodcast440@gmail.com', 
      pass: 'clnj hmwa zwfh gfcl', 
    },
  });

  async function main() {
    const mailOptions = {
      from: `${email}`, // Địa chỉ người gửi
      to: `foodcast440@gmail.com`, 
      subject: `${email} Gửi Liên Hệ Khách Hàng`, // Chủ đề email
      text: `Nội dung: ${message}`, // Nội dung văn bản
      html:  `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Contact</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .email-header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }
          .email-content {
            padding: 20px;
          }
          .message {
            margin-top: 10px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
      
          <div class="email-content">
            <p><strong>Email:</strong> ${email}</p>
              <p><strong>Tên:</strong> ${full_name}</p>
            <div class="message">
              <p><strong>Nội dung:</strong></p>
              <p>${message}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
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