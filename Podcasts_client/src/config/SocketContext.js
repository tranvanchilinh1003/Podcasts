// src/config/SocketContext.js
import React, { createContext, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080', {
    transports: ['websocket'], // Chỉ sử dụng websocket để tránh fallback
  });

  useEffect(() => {
    // Kiểm tra kết nối
    socket.on('connect', () => {
      console.log('Kết nối Socket.io thành công:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket.io đã ngắt kết nối');
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
