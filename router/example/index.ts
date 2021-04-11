import http from "http";
import server from "express";
import { Server as SocketServer } from "socket.io";
import cors from "cors";

import { Router } from "../src/Router/index";
import { SocketRequestWithParams } from "../../commons/types";

const mainSocketRouter = new Router({});

const io = new SocketServer({
  path: "/socket.io",
  transports: ["websocket"],
  pingInterval: 5000,
  pingTimeout: 5000,
});
const app = server();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.options("*", cors);

app.route("/aaa/:id").get((req, res) => {
  res.send(req.params.id);
});

const httpServer = http.createServer(app);

io.attach(httpServer);
mainSocketRouter.bind(io);
mainSocketRouter.route(
  "/test",
  async (req, res, next) => {
    await next();
  },
  async (req, res, next) => {
    res.send({
      test: "test",
    });
  }
);

const r = new Router({
  mountPath: "/test2",
});

r.route("/:id", async (req: SocketRequestWithParams, res) => {
  req.socket.broadcast.to("dqdqsdqsdqs").emit("dsqdqsdqsdq")
  
  res.send({
    //@ts-ignore
    test: req.params.id,
  });
});

mainSocketRouter.use(r);

httpServer.listen(3000, () => {
  console.log("example http server running on port 3000");
});
