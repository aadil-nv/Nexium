import { io } from "socket.io-client";

const socket = io("https://backend.aadil.online/socket");

export default socket;
