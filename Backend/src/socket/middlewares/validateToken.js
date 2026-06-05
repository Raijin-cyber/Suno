import { jwtVerify } from "jose";
import cookie from "cookie";
import { SOCKET_EVENTS } from "../Config/socketEvents.js";
import createWsErrorObject from "../utils/createWsErrorObject.js";

const validateToken = (socket) => {
  socket.onAny(async (event, ...args) => {
    const cookies = socket.handshake.headers.cookie || "";
    const parsedCookies = cookie.parse(cookies);

    const wsToken = parsedCookies.wsToken;
    if (!wsToken) {
      socket.emit(
        SOCKET_EVENTS.ERROR,
        createWsErrorObject(401, "Missing WebSocket token")
      );
      socket.disconnect(true);
      return;
    }

    try {
      // jose requires a Uint8Array key
      const secret = new TextEncoder().encode(process.env.WS_TOKEN_SECRET);

      // verify token validity
      const { payload } = await jwtVerify(wsToken, secret);

      // attach user context if present
      socket.user = payload.user;
    } catch (err) {
      socket.emit(
        SOCKET_EVENTS.ERROR,
        createWsErrorObject(401, "Invalid or expired WebSocket token")
      );
      return;
    }
  });
};

export default validateToken;
