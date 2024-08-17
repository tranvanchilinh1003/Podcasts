var mysql = require("mysql");
var connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "frontend1",
});
connect.connect(function (err) {
  if (err) throw err;
  console.log("Database is connected successfully !");
});
module.exports = connect;

