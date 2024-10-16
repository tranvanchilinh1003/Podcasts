const session = require('express-session');

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Đặt là true nếu sử dụng HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 ngày
    }
});

module.exports = sessionMiddleware;
