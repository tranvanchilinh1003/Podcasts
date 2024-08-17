const axios = require("axios");
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const moment = require('moment-timezone');
const app = express();
app.use(express.json());
const API_URL = "http://localhost:3000/api";
const comment = require('../../models/comment')
const post = require('../../models/post')
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
    const View = await post.post_view(req.params.id);
    const [categoriesResponse, posts_cateResponse, list_comments ] = await Promise.all([
      axios.get(`${API_URL}/categories/`),
      axios.get(`${API_URL}/getId_post/${req.params.id}`),
      axios.get(`${API_URL}/comment/${req.params.id}`),
      req.session.post_id = req.params.id,
    ]);
    const comments_List =  list_comments.data;
    const categoriesData = categoriesResponse.data;
    const post_categoriesData = posts_cateResponse.data;
    res.render("client/menu/product-single", {
      categories: categoriesData.data,
      post_cate: post_categoriesData.data[0],
      comments_List: comments_List.data,
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

exports.addComment = async (req, res, next) => {
  const comments = {
      contents: req.body.contents,
    date:  moment.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'),
    post_id : req.session.post_id ,
    customers_id: req.session.userId,
    rating: req.body.rating,
  };

  try {
    const response = await comment.createComment(comments);
   
      res.redirect(`/client/menu/post_details/${req.session.post_id }`);
    
  } catch (err) {
    console.error("ERR", err);
    res.status(500).send("Internal Server Error");
  }
};