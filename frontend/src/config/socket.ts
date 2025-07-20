import { io } from "socket.io-client";

const socket = io("https://backend.aadilnv.online/socket");

export default socket;
