const express = require('express');
const cors = require('cors');
const multer = require("multer");
let path = require("path");
const app = express();
var bodyParser = require("body-parser");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const session = require('express-session');
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let cart = [];
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
module.exports = app;
const port = 3000;

function md5(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/styles", express.static("styles"));
app.use("/uploads", express.static("uploads"));


const api = require('./routes/api');
app.use('/api', api);

const client = require('./routes/client');
app.use('/client', client);



let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }
    let filename = `${Date.now()}-linhpc06747-${file.originalname}`;
    callback(null, filename);
  },
});
  
  let uploadFile = multer({ storage: diskStorage }).single("image");
  // Route này Xử lý khi client thực hiện hành động upload file
  app.post("/upload_img", (req, res) => {
    // Thực hiện upload file, truyền vào 2 biến req và res
    uploadFile(req, res, (error) => {
      // Nếu có lỗi thì trả về lỗi cho client.
      // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
      if (error) {
        return res.send(`Error when trying to upload: ${error}`);
      }
      const filename = req.file.filename;
      res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`));
      // res.redirect("/custumers/list");
    });
  });
  
  app.listen(port, () => {
    console.log(`ứng dụng chạy với port: ${port}`);
  });
  