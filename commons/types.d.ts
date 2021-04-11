import {
  Socket,
  Server as SocketServer,
} from "../router/node_modules/socket.io/dist";
import { MatchFunction } from "../router/node_modules/path-to-regexp";

export type SocketRequestParams = {};

export type SocketMessageBody = Omit<
  Record<string | number | symbol, unknown>,
  "error"
>;

export type SocketErrorMessage = {
  error: "bad_request" | "not_found" | "unauthorized" | "unknown_error";
  code: string;
  message: string;
};

export type SocketResponse<
  ResponseBody extends SocketMessageBody = SocketMessageBody
> = {
  isSent: boolean;
  send: (response: ResponseBody) => void;
  end: (response: ResponseBody) => void;
  error: (error: SocketErrorMessage) => void;
};

export interface SocketRequest<
  B extends SocketMessageBody = SocketMessageBody
> {
  path: string;
  body: B;
}

export interface SocketRequestWithParams<
  B extends SocketMessageBody = SocketMessageBody,
  P extends SocketRequestParams = SocketRequestParams
> {
  server: SocketServer;
  socket: Socket;
  path: string;
  body: B;
  params: P;
}

export type NextHandlerCallback = (error?: Error) => Promise<void>;

/** */
export type SocketMainHandler<
  RequestBody extends SocketMessageBody = SocketMessageBody,
  ResponseBody extends SocketMessageBody = SocketMessageBody
> = (
  socket: Socket,
  req: SocketRequest<RequestBody>,
  res: SocketResponse<ResponseBody>,
  next?: NextHandlerCallback
) => Promise<void>;

export type SocketHandlerFunction<
  ReturnType extends unknown = void,
  RequestBody extends SocketMessageBody = SocketMessageBody,
  RequestParams extends SocketRequestParams = SocketRequestParams,
  ResponseBody extends SocketMessageBody = SocketMessageBody
> = (
  req: SocketRequestWithParams<RequestBody, RequestParams>,
  res: SocketResponse<ResponseBody>,
  next: NextHandlerCallback
) => Promise<ReturnType>;

export type SocketHandler<MatchType extends object = object> = {
  path: string;
  stack: SocketHandlerFunction[];
  match: MatchFunction<MatchType>;
  handle: (
    this: SocketHandler<MatchType>,
    req: SocketRequestWithParams,
    res: SocketResponse,
    next: NextHandlerCallback
  ) => Promise<void>;
};

export type RouterOptions = {
  mountPath: string;
};

export type DefaultRouterOptions = RouterOptions & {
  mountPath: "/";
};

type callFunction = (this: RouterType) => SocketHandlerFunction;

export declare abstract class RouterType {
  protected abstract socketServer: SocketServer | null;
  protected abstract routerOptions: RouterOptions;
  protected abstract handlers: SocketHandler[];
  public abstract use(
    this: RouterType,
    handler: SocketHandlerFunction | SocketHandlerFunction[] | RouterType
  ): void;
  public abstract route(
    this: RouterType,
    path: string,
    ...fn: SocketHandlerFunction[]
  ): void;
  public abstract bind: (io: SocketServer) => void;
  public abstract call: callFunction;
  public abstract getHandlers(this: RouterType): SocketHandler[];
}
