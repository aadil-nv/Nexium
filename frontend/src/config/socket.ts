import { io } from "socket.io-client";

const socket = io("https://www.aadil.online/communication-service/socket");
export default socket;
