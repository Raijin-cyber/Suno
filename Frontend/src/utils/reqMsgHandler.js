const reqMsgHandler = (statusCode) => {
  switch (statusCode) {
    // Success
    case 200: return "OK - Request succeeded";
    case 201: return "Created - Resource successfully created";
    case 202: return "Accepted - Request accepted but not yet processed";
    case 204: return "No Content - Success, no response body";

    // Redirection
    case 301: return "Moved Permanently - Resource moved to new URL";
    case 302: return "Found - Temporary redirect";
    case 304: return "Not Modified - Cached version still valid";
    case 307: return "Temporary Redirect - Method preserved";
    case 308: return "Permanent Redirect - Method preserved";

    // Client Errors
    case 400: return "Bad Request - Invalid request syntax or parameters";
    case 401: return "Unauthorized - Invalid email or password";
    case 403: return "Forbidden - Authenticated but not allowed";
    case 404: return "Not Found - Resource not found";
    case 405: return "Method Not Allowed - HTTP method not supported";
    case 408: return "Request Timeout - Server timed out waiting";
    case 409: return "Conflict - Record already exists";
    case 410: return "Gone - Resource permanently removed";
    case 413: return "Payload Too Large - Request body too big";
    case 414: return "URI Too Long - URL too long";
    case 415: return "Unsupported Media Type - Content type not supported";
    case 418: return "I'm a Teapot - Joke status (RFC 2324)";
    case 422: return "Unprocessable Entity - Semantic errors in request";
    case 429: return "Too Many Requests - Rate limit exceeded";

    // Server Errors
    case 500: return "Internal Server Error - Generic server failure";
    case 501: return "Not Implemented - Method not supported";
    case 502: return "Bad Gateway - Invalid response from upstream server";
    case 503: return "Service Unavailable - Server overloaded or down";
    case 504: return "Gateway Timeout - Upstream server timed out";
    case 505: return "HTTP Version Not Supported";

    // Default fallback
    default: return `Unknown Status Code: ${statusCode}`;
  }
};

export default reqMsgHandler;
