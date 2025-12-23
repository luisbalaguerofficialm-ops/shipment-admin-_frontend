import { io } from "socket.io-client";

const socket = io("https://admin-ship-backend.onrender.com", {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
