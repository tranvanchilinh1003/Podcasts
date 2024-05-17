const axios = require("axios");
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(express.json());

exports.login = async (req, res, next) => {
  try {
    res.render("client/form/login", {

        
        });
  } catch (error) {
    console.error('ERR', error);
    res.status(500).send(error);
  }
};
exports.signup = async (req, res, next) => {
  try {
    res.render("client/form/signup", {

        
        });
  } catch (error) {
    console.error('ERR', error);
    res.status(500).send(error);
  }
};
exports.getform = async (req, res, next) => {
  try {
    res.render("client/form/info", {
      
        });
  } catch (error) {
    console.error('ERR', error);
    res.status(500).send(error);
  }
};