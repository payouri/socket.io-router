import {
  RouterType,
  SocketHandler,
  SocketHandlerFunction,
  SocketRequestWithParams,
} from "@commons/types";
import { joinPaths } from "../utils/joinPaths";
import { consecutivesSlashsRegexp } from "../regexp/consecutivesSlashs";
import handlerMatch from "../utils/match";
import handleRequest from "./handleRequest";

export function bindRoute(
  this: RouterType,
  path: string,
  ...handler: SocketHandlerFunction[]
) {
  const formattedPath = joinPaths(this.routerOptions.mountPath, path).replace(
    consecutivesSlashsRegexp,
    "/"
  );
  this.handlers.push({
    path: formattedPath,
    stack: Array.isArray(handler) ? handler : [handler],
    match: handlerMatch(formattedPath),
    handle: async function (...args) {
      await handleRequest(this.stack, ...args);
    },
  });
}

export default bindRoute;
