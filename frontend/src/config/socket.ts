import { io } from "socket.io-client";

const socket = io("https://backend.aadil.online/communication-service/socket");
export default socket;
