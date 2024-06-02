const Custumers = require("../../models/customers");
const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    let math = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }
    let filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});
let uploadFile = multer({ storage: diskStorage }).single("image");

exports.list = async (req, res, next) => {
  var custumers = await Custumers.getALLCustumers();
  res.status(200).json({
    data: custumers,
  });
};


exports.delete = async (req, res, next) => {
  var custum = await Custumers.Delete(req.params.id);
  res.status(200).json({
    data: custum,
  });
};