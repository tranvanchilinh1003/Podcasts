const axios = require("axios");
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(express.json());

exports.getPostDetail = async (req, res, next) => {
  try {
    res.render("client/menu/product-single", {

        
        });
  } catch (error) {
    console.error('ERR', error);
    res.status(500).send(error);
  }
};
