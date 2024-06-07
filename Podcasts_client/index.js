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
const admin = require("firebase-admin");
const uuid = require('uuid-v4')
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

var serviceAccount = require("./podcast-ba34e-firebase-adminsdk-nd5pm-f65843b35b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "podcast-ba34e.appspot.com",
});

const bucket = admin.storage().bucket();
const storage = multer.memoryStorage();
const upload = multer({storage: storage}).single('image');

app.post("/upload_img", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: 'Lỗi khi tải lên' });
    } else if (err) {
      return res.status(500).json({ error: 'Lỗi khi tải lên' });
    }

    if (!req.file) {
      return res.status(400).send('Không có tệp được tải lên');
    }

    const filename = req.file.originalname;
    const blob = bucket.file( `upload/${filename}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          FirebaseStoreDowloadToken: uuid()
        }
      },
      gzip: true
    });

    blobStream.on('error', err => {
      return res.status(500).json({ error: 'Lỗi khi tải lên' });
    });

    blobStream.on('finish', () => {
      const imageUrl = `https://storage.googleapis.com/podcast-ba34e.appspot.com/${filename}`;
      const imageName = req.file.originalname;
      return res.status(200).json({imageName, imageUrl });
    });

    blobStream.end(req.file.buffer);
  });
});

  
app.listen(port, () => {
    console.log(`ứng dụng chạy với port: ${port}`);
  });
  