// wsErrorUtils.js

export const WSErrorCodes = {
  INVALID_PAYLOAD: 400,   // Bad Request
  UNAUTHORIZED: 401,      // Unauthorized
  FORBIDDEN: 403,         // Forbidden
  ROOM_NOT_FOUND: 404,    // Not Found
  MESSAGE_TOO_LONG: 413,  // Payload Too Large
  USER_NOT_FOUND: 404,    // Not Found
  RATE_LIMITED: 429,      // Too Many Requests
  INTERNAL_ERROR: 500,    // Internal Server Error
};

export const WSErrorMessages = {
  [WSErrorCodes.INVALID_PAYLOAD]: "Payload is missing or malformed",
  [WSErrorCodes.UNAUTHORIZED]: "You are not authorized to perform this action",
  [WSErrorCodes.FORBIDDEN]: "You do not have permission for this event",
  [WSErrorCodes.ROOM_NOT_FOUND]: "Conversation room does not exist",
  [WSErrorCodes.MESSAGE_TOO_LONG]: "Message exceeds allowed length",
  [WSErrorCodes.USER_NOT_FOUND]: "Target user does not exist",
  [WSErrorCodes.RATE_LIMITED]: "Too many requests, slow down",
  [WSErrorCodes.INTERNAL_ERROR]: "Unexpected server error occurred",
};

const createWsErrorObject = (code, errorMessage) => {
  return {
    code,
    message: errorMessage || WSErrorMessages[code] || "Unknown WebSocket error",
    timestamp: new Date().toISOString(),
    type: "WebSocketError",
  };
};

export default createWsErrorObject;
