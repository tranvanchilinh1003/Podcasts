// middlewares/socket.js
const socketIo = require('socket.io');
const sharedSession = require("socket.io-express-session"); 

let ioInstance;

const initSocketIO = (server, sessionMiddleware) => {  
    const io = socketIo(server, {
        cors: {
          origin: process.env.CLIENT_URL || "http://localhost:3000", 
          methods: ["GET", "POST", "PATCH", "DELETE"],
          credentials: true // Cho phép gửi cookie
        }
      });
    
    // Sử dụng shared session middleware
    io.use(sharedSession(sessionMiddleware, {
        autoSave: true
    })); 

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
    
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });
    });
    
    ioInstance = io;
    return ioInstance; 
};

const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io chưa được khởi tạo!");
    }
    return ioInstance;
}

module.exports = { initSocketIO, getIO };
