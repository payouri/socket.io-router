import { Socket } from "socket.io-client";
import { nanoid } from "nanoid";
import {
  SocketRequest,
  SocketMessageBody,
  SocketErrorMessage,
} from "@commons/types";
export * from "@commons/types";

function wrapEmit<R extends SocketMessageBody = SocketMessageBody>(
  socket: Socket,
  message: SocketRequest
): Promise<R> {
  return new Promise<R>((resolve, reject) => {
    const requestId = nanoid();
    socket.emit(
      "request",
      {
        ...message,
        headers: {
          ...message.headers,
          "xxx-request-id": requestId,
        },
      },
      (response: SocketErrorMessage | R) => {
        if ("error" in response) {
          reject(response);
        }
        console.log("response", response);
        resolve(response as R);
      }
    );
  });
}

function sendRequest<R extends SocketMessageBody = SocketMessageBody>(
  socket: Socket,
  message: SocketRequest
) {
  return wrapEmit<R>(socket, message);
}

// const sendRequests =

export const SocketRouterClient = (socketIoClient: Socket) => {
  const currentSocket = socketIoClient;

  return {
    get socket() {
      return currentSocket;
    },
    request: function <R extends SocketMessageBody = SocketMessageBody>(
      request: SocketRequest
    ) {
      return sendRequest<R>(currentSocket, request);
    },
  };
};

// const a = SocketRouterClient(io()).request<{ Test: string }>({
//   path: "/bidule/",
//   body: {
//     qdqsdq: "dqdqsdqs"
//   }
// });

// a.then((val) => {
//   val.Test;
// });
export { SocketRouterClient as Client };
