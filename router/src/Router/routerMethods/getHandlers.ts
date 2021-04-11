import { RouterType } from "@commons/types";

export function getHandlers(this: RouterType): RouterType["handlers"] {
  return this.handlers;
}

export default getHandlers;
