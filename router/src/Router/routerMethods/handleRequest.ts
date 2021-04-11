import {
  NextHandlerCallback,
  SocketHandler,
  SocketRequest,
  SocketRequestWithParams,
  SocketResponse,
} from "@commons/types";
import {} from "path-to-regexp";

export async function handleRequest(
  stack: SocketHandler["stack"],
  req: SocketRequestWithParams,
  res: SocketResponse,
  next: NextHandlerCallback
) {
  let index = 0;
  const n = stack.length;

  const nextWrapper = async (error?: Error) => {
    if (error) {
      return next(error);
    } else if (index >= n) {
      return next();
    } else {
      index += 1;
    }
  };

  while (index < n && !res.isSent) {
    await stack[index](req, res, nextWrapper);
  }
}

export default handleRequest;
