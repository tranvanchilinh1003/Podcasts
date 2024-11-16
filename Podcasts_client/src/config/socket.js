// socket.js
import io from "socket.io-client";

let socket;

const getSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:8080", {
      transports: ["websocket"],
    });
  }
  return socket;
};

export default getSocket;
