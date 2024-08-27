const express = require('express');
const cors = require('cors');
const multer = require("multer");
let path = require("path");
const app = express();
var bodyParser = require("body-parser");
const session = require('express-session');
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
module.exports = app;
const port = 8080;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/styles", express.static("styles"));
app.use("/uploads", express.static("uploads"));


const api = require('./routes/api');
app.use('/api', api);


  
app.listen(port, () => {
    console.log(`ứng dụng chạy với port: ${port}`);
  });
  