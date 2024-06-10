const axios = require("axios");
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(express.json());
const API_URL = "http://localhost:3000/api";
exports.getPostDetail = async (req, res, next) => {
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
      axios.get(`${API_URL}/getId_post/${req.params.id}`)
    ]);

    const categoriesData = categoriesResponse.data;
    const post_categoriesData = posts_cateResponse.data;
    res.render("client/menu/product-single", {
      categories: categoriesData.data,
      post_cate: post_categoriesData.data[0],
    
      user: info,
      userId: userId
    });
  } catch (error) {
    console.error('ERR', error);
    res.render('client/menu/product-single', {
      categories: [],
      post_cate: [],

      user: info,
      userId: userId
    });
  }
};

