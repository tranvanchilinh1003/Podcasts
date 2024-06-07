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
    // const response = await axios.get(`${API_URL}/products/`);
    // const data = response.data;

    res.render('client/index', {
      // data: data.data,
      user: info,
      userId: userId
    });
  } catch (error) {
    console.error('Error:', error);
    res.render('client/index', {
      data: [],
      user: info,
      userId: userId
    });
  }
};

exports.getAbout = async (req, res, next) => {
  try {
    res.render("client/about", {

        
        });
  } catch (error) {
    console.error('ERR', error);
    res.status(500).send(error);
  }
};

exports.getContact = async (req, res, next) => {
  try {
    res.render("client/contact", {

        
        });
  } catch (error) {
    console.error('ERR', error);
    res.status(500).send(error);
  }
};
exports.getMenu = async (req, res, next) => {
  try {
    res.render("client/menu/product", {

        
        });
  } catch (error) {
    console.error('ERR', error);
    res.status(500).send(error);
  }
};
