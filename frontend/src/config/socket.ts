import { io } from "socket.io-client";

const socket = io("http://localhost:7006/socket");

export default socket;
