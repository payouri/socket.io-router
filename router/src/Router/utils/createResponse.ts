import { SocketMessageBody, SocketResponse } from "@commons/types";

export const createResponse = (
  callback: SocketResponse["send"]
): SocketResponse => ({
  isSent: false,
  send: function (responseBody) {
    if (this.isSent) {
      throw new Error("Response Already Sent");
    }
    this.isSent = true;
    console.log("responseBody", responseBody);
    callback(responseBody);
  },
  error: function (err) {
    if (this.isSent) {
      throw new Error("Response Already Sent");
    }
    this.isSent = true;
    if (!this.isSent) {
      callback(err);
    }
  },
  end: () => {},
});

export default createResponse;
