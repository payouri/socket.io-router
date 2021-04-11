import { io } from "socket.io-client/dist/socket.io.js";
import { Client } from "../../src/Client/index";

const socketClient = io("localhost:3000/", {
  transports: ["websocket"],
});

const client = Client(socketClient);
console.log("dsqd");
setInterval(async () => {
  const res = await client.request({
    path: "/test",
    body: {
      truc: Math.random(),
    },
  });

  console.log("dsqdsq", res);
}, 3000);
