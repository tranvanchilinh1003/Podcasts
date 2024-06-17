const axios = require("axios");
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { log } = require("console");
const API_URL = "http://localhost:3000/api";

const app = express();
app.use(express.json());
const post = require('../../models/post')
exports.login = async (req, res, next) => {
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
    res.render("client/form/login", {
      categories: categoriesData.data,
        
        });
  } catch (error) {
    console.error('ERR', error);
    res.render('client/login', {
      categories: [],
      user: info,
      userId: userId
    });
  }
};

exports.signup = async (req, res, next) => {
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
    res.render("client/form/signup", {
      categories: categoriesData.data, 
        
        });
  } catch (error) {
    console.error('ERR', error);
    res.render('client/signup', {
      categories: [],
      user: info,
      userId: userId
    });
  }
};

exports.createUser = async function (req, res) {
  const categoriesResponse = await axios.get(`${API_URL}/categories/`);
  const categoriesData = categoriesResponse.data;
  try {

    const custumer = {
      username: req.body.username,
      full_name: req.body.full_name,
      password: req.body.password,
      email: req.body.email,
      images: '1711556637138-anh_dai_dien.jpg',
      role: 'user',
      isticket: 'inactive',
      gender: 0,
    }

    const response = await axios.post(`${API_URL}/customers`,  custumer);
    if (response.status === 200) {
      res.redirect('/client/form/login');
    } else {
      let err = response.data.error;
      res.render('client/form/signup', { errorMessage: err, categories: categoriesData.data});
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      res.render('client/form/signup', { errorMessage: "Username hoặc email đã tồn tại.",   categories: categoriesData.data });
    } else {
      res.render('client/form/signup', { errorMessage: "Đã xảy ra lỗi khi thêm người dùng.",   categories: categoriesData.data });
    }
  }
};

exports.loginUser = async function (req, res) {
  const categoriesResponse = await axios.get(`${API_URL}/categories/`);
  const categoriesData = categoriesResponse.data;
  try {
  
    let username = req.body.username;
    let password = req.body.password;

    let response = await axios.post(`${API_URL}/customers/login`, {
        username: username,
        password: password,
    });

    let data = response.data;

    if (data.status === 1) {
      req.session.userId = data.data[0].id;
      res.redirect('/client/');
      
    } else {
      let err = data.message;
      res.render('client/form/login', { errorMessage: err, categories: categoriesData.data});
    }
  } catch (error) {
    
    let errorMessage = error.response ? error.response.data.message : 'Đã xảy ra lỗi không mong muốn.';
    res.render('client/form/login', { errorMessage: errorMessage,   categories: categoriesData.data });
  }
};

exports.getform = async (req, res, next) => {
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
    res.render("client/form/info", {
      categories: categoriesData.data,
        });
  } catch (error) {
    console.error('ERR', error);
    res.render('client/info', {
      categories: [],
      user: info,
      userId: userId
    });
  }
};


exports.getsearch = async (req, res, next) => {
  try {
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
    const categoriesResponse = await axios.get(`${API_URL}/categories/`);
    const categoriesData = categoriesResponse.data;
    const key = req.query.message;
  
    
    const responseCate = await post.search(key)
    if(key === ' '){
      res.redirect("/client/menu/product-all");
    }
    if (!responseCate || responseCate.length === 0) {
      const message = 'Không tìm thấy sản phẩm';
      res.render("client/menu/product-all", {
        user: info,
        categories: categoriesData.data, 
        post_cate: [],
        message: message 
      });
      return; 
    }
    
    res.render("client/menu/product-all", {
      user: info,
      categories: categoriesData.data, 

      post_cate: responseCate
    });
  } catch (error) {
    console.error("ERR", error);
    res.status(500).send(error);
  }
};
