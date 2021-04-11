import {
  SocketRequest,
  SocketRequestParams,
  SocketRequestWithParams,
} from "@commons/types";
import { Server, Socket } from "socket.io";

export const buildRequest = (
  server: Server,
  socket: Socket,
  requestMessage: SocketRequest,
  params: SocketRequestParams
): SocketRequestWithParams => {
  const { path } = requestMessage;
  return {
    ...requestMessage,
    server,
    socket,
    params,
    headers: requestMessage.headers || {},
    get originalUrl() {
      return path;
    },
  };
};
