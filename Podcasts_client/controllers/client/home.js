const axios = require("axios");
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(express.json());

exports.homeClient = async (req, res, next) => {
  try {
    res.render("client/index", {

        
        });
  } catch (error) {
    console.error('ERR', error);
    res.status(500).send(error);
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
