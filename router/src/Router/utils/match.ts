import { SocketHandler } from "@commons/types";
import { match, MatchFunction } from "path-to-regexp";

export const handlerMatch = function <T extends object = object>(
  path: string
): MatchFunction {
  const fn = match<T>(path, {
    decode: decodeURIComponent,
  });
  return fn;
};

export default handlerMatch;
