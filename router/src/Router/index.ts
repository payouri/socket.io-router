import { Match, parse } from "path-to-regexp";
import { Server, Socket } from "socket.io";
import {
  bindRoute as bindRouteMethod,
  useHandler as useHandlerMethod,
  getHandlers as getHandlersMethod,
} from "./routerMethods";
import {
  RouterType,
  RouterOptions,
  DefaultRouterOptions,
  SocketHandlerFunction,
  SocketResponse,
  SocketRequestWithParams,
  SocketMessageBody,
  SocketRequest,
  SocketMainHandler,
  NextHandlerCallback,
  SocketHandler,
  SocketErrorMessage,
} from "@commons/types";
import createResponse from "./utils/createResponse";
import { buildRequest } from "./utils/buildRequest";

const routerDefaultOptions: DefaultRouterOptions = {
  mountPath: "/",
};

const createNextHandler = (
  req: SocketRequestWithParams,
  res: SocketResponse,
  cb: () => Promise<void>
): NextHandlerCallback => {
  return cb;
};

export const Router = (function Router(
  this: RouterType,
  options: Partial<RouterOptions> = {}
): RouterType {
  this.routerOptions = {
    ...routerDefaultOptions,
    ...options,
  };

  this.socketServer = null;

  this.handlers = [];

  const useRouter = useHandlerMethod.bind(this);

  const bindRoute = bindRouteMethod.bind(this);

  const getHandlers = getHandlersMethod.bind(this);

  const handle: SocketMainHandler = async (
    socket,
    reqWithoutParams,
    res,
    injectedNext
  ): Promise<void> => {
    if (!this.socketServer) return;

    let match: false | Match = false;
    let index = 0;
    const n = this.handlers.length;
    let req: SocketRequestWithParams | undefined = undefined;
    let error: null | Error = null;

    const walkHandlers = async (error?: Error) => {
      if (!this.socketServer) return;

      while (index < n) {
        match = this.handlers[index].match(reqWithoutParams.path);
        if (match) {
          const { params } = match;
          const handler = this.handlers[index];
          let nextCalled = false;
          req = buildRequest(
            this.socketServer,
            socket,
            reqWithoutParams,
            params
          );
          const next = async (err?: Error) => {
            if (err) {
              console.warn("err", err);
              error = err;
            }
            index++;

            nextCalled = true;
          };

          await handler.handle(req, res, next);

          if (error || !nextCalled) {
            return;
          }
        } else {
          index++;
        }
      }
    };

    await walkHandlers();

    if (!error && !res.isSent) {
      res.error({
        error: "not_found",
        code: "R-000-000",
        message: `route ${reqWithoutParams.path} not found`,
      });
    }
  };

  const requestHandler = (
    socket: Socket,
    message: SocketRequest,
    callback: SocketResponse["send"]
  ) => {
    if ("path" in message && typeof message.path === "string") {
      console.log("Request", message);
      handle(socket, message, createResponse(callback));
    }
  };

  const bindServer = (server: Server) => {
    server.on("connect", (socket) => {
      socket.on("request", (message, callback) => {
        if (!("path" in message) || typeof message.path !== "string") {
          callback({
            error: "bad_request",
            message: 'required field "path" is invalid',
            code: "G-000-000",
          } as SocketErrorMessage);
        }
        try {
          requestHandler(socket, message, callback);
        } catch (err) {
          console.warn(err);
        }
      });

      socket.on("disconnect", () => {
        // socket.off("request", requestHandler);
      });
    });
    this.socketServer = server;
  };

  const getOptions = () => {
    return { ...this.routerOptions };
  };

  //@ts-ignore
  return {
    use: useRouter,
    route: bindRoute,
    // call: () => callRouter,
    // handle:
    bind: bindServer,
    get handlers() {
      return [...getHandlers()];
    },
    get routerOptions() {
      return getOptions();
    },
  };
} as unknown) as new (options: Partial<RouterOptions>) => RouterType;
