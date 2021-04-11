import { parse, match } from "path-to-regexp";

export const createPathMatch = (path: string) => match(path);
