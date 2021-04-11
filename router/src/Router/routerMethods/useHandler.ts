import {
  SocketHandlerFunction,
  RouterType,
} from "@commons/types";
import handlerMatch from "../utils/match";
import { handleRequest } from "./handleRequest";

export function useHandler(
  this: RouterType,
  fn: SocketHandlerFunction | SocketHandlerFunction[] | RouterType
): void {
  if ("handlers" in fn) {
    this.handlers.push(...fn.handlers);
  } else {
    this.handlers.push({
      path: "/",
      stack: Array.isArray(fn) ? fn : [fn],
      match: handlerMatch("/"),
      handle: async function (...args) {
        await handleRequest(this.stack, ...args);
      },
    });
  }
}

export default useHandler;
