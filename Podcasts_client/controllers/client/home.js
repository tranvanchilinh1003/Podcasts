const axios = require("axios");
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(express.json());
const API_URL = "http://localhost:3000/api";

exports.homeClient = async (req, res, next) => {
  let userId = req.session.userId;
  let info = null;

  if (typeof userId !== 'undefined') {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      info = response.data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  try {
    const [categoriesResponse, postsResponse] = await Promise.all([
      axios.get(`${API_URL}/categories/`),
      axios.get(`${API_URL}/post/`)
    ]);
    const categoriesData = categoriesResponse.data;
    const postsData = postsResponse.data;

    res.render('client/index', {
      categories: categoriesData.data, // Assuming categories data is under 'data' key
      posts: postsData.data, // Assuming posts data is under 'data' key
      user: info,
      userId: userId
    });
  } catch (error) {
    console.error('Error:', error);
    res.render('client/index', {
      categories: [],
      posts: [],
      user: info,
      userId: userId
    });
  }
};


exports.getAbout = async (req, res, next) => {
  let userId = req.session.userId;
  let info = null;

  if (typeof userId !== 'undefined') {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      info = response.data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  try {
    const categoriesResponse = await axios.get(`${API_URL}/categories/`);
    const categoriesData = categoriesResponse.data;
    res.render("client/about", {
      categories: categoriesData.data, 

    });
  } catch (error) {
    console.error('ERR', error);
    res.render('client/about', {
      categories: [],
      user: info,
      userId: userId
    });
  }
};

exports.getContact = async (req, res, next) => {
  let userId = req.session.userId;
  let info = null;

  if (typeof userId !== 'undefined') {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      info = response.data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  try {
    const categoriesResponse = await axios.get(`${API_URL}/categories/`);
    const categoriesData = categoriesResponse.data;
    res.render("client/contact", {
      categories: categoriesData.data, 

    });
  } catch (error) {
    console.error('ERR', error);
    res.render('client/contact', {
      categories: [],
      user: info,
      userId: userId
    });
  }
};
exports.getMenu = async (req, res, next) => {
  let userId = req.session.userId;
  let info = null;

  if (typeof userId !== 'undefined') {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      info = response.data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  try {
    const [categoriesResponse, posts_cateResponse] = await Promise.all([
      axios.get(`${API_URL}/categories/`),
      axios.get(`${API_URL}/product/${req.params.id}`)
    ]);
    const categoriesData = categoriesResponse.data;
    const post_categoriesData = posts_cateResponse.data;
    res.render("client/menu/product", {
      categories: categoriesData.data, 
      post_cate: post_categoriesData.data, 
      message: "Không tìm thấy bài đăng nào với thể loại này",

    });
  } catch (error) {
    console.error('ERR', error);
    res.render('client/product', {
      categories: [],
      post_cate: [],
      user: info,
      userId: userId
    });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Lỗi khi đăng xuất:', err);
      res.status(500).send('Đã xảy ra lỗi khi đăng xuất');
    } else {
      res.redirect('/client/form/login'); 
    }
  });
}

