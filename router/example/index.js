"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const index_1 = require("../src/Router/index");
const mainSocketRouter = new index_1.Router({});
const io = new socket_io_1.Server({
    path: "/socket.io",
    transports: ["websocket"],
    pingInterval: 5000,
    pingTimeout: 5000,
});
const app = express_1.default();
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use(cors_1.default());
app.options("*", cors_1.default);
app.route("/aaa/:id").get((req, res) => {
    res.send(req.params.id);
});
const httpServer = http_1.default.createServer(app);
io.attach(httpServer);
mainSocketRouter.bind(io);
mainSocketRouter.route("/test", async (req, res, next) => {
    await next();
}, async (req, res, next) => {
    res.send({
        test: "test",
    });
});
const r = new index_1.Router({
    mountPath: "/test2",
});
r.route("/:id", async (req, res) => {
    console.log(this);
    res.send({
        //@ts-ignore
        test: req.params.id,
    });
});
mainSocketRouter.use(r);
httpServer.listen(3000, () => {
    console.log("example http server running on port 3000");
});
//# sourceMappingURL=index.js.map