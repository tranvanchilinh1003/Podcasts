const axios = require("axios");
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { log } = require("console");
const API_URL = "http://localhost:3000/api";

const app = express();
app.use(express.json());
const API_URL = "http://localhost:3000/api";
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
  try {
    const custumer = {
      username: req.body.username,
      full_name: req.body.full_name,
      password: req.body.password,
      email: req.body.email,
      images: 'user.jpg',
      role: 'user',
      isticket: 'inactive',
      gender: 0,
    }

    const response = await axios.post(`${API_URL}/customers`,  custumer);
    if (response.status === 200) {
      res.redirect('/client/form/login');
    } else {
      let err = response.data.error;
      res.render('client/form/signup', { errorMessage: err });
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      res.render('client/form/signup', { errorMessage: "Username hoặc email đã tồn tại." });
    } else {
      res.render('client/form/signup', { errorMessage: "Đã xảy ra lỗi khi thêm người dùng." });
    }
  }
};

exports.loginUser = async function (req, res) {
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
      res.render('client/form/login', { errorMessage: err });
    }
  } catch (error) {
    let errorMessage = error.response ? error.response.data.message : 'Đã xảy ra lỗi không mong muốn.';
    res.render('client/form/login', { errorMessage: errorMessage });
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
