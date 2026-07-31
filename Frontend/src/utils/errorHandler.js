function getSeverity(error) {
    if (!(error instanceof Error)) return "unknown";

    // Runtime bugs that usually crash rendering
    if (
        error instanceof TypeError ||
        error instanceof ReferenceError
    ) {
        return "high";
    }

    // Bugs that may not always crash the app
    if (
        error instanceof RangeError ||
        error instanceof SyntaxError ||
        error instanceof URIError
    ) {
        return "medium";
    }

    const message = error.message.toLowerCase();

    // Temporary failures
    if (
        message.includes("fetch") ||
        message.includes("network") ||
        message.includes("timeout")
    ) {
        return "medium";
    }

    return "low";
}

function isRetryable(error) {
    if (!(error instanceof Error)) return false;

    const message = error.message.toLowerCase();

    // Programming errors should never be retried
    if (
        error instanceof TypeError ||
        error instanceof ReferenceError ||
        error instanceof SyntaxError ||
        error instanceof RangeError
    ) {
        return false;
    }

    // Temporary/network failures
    const retryableMessages = [
        "fetch",
        "network",
        "timeout",
        "503",
        "502",
        "504",
        "rate limit",
        "too many requests",
        "temporarily unavailable",
        "connection reset",
        "connection refused",
        "failed to fetch",
    ];

    return retryableMessages.some((text) =>
        message.includes(text)
    );
}

const errorHandler = (error, info = {}) => {
    // Route information
    const pathname = info.location?.pathname ?? "";
    const search = info.location?.search ?? "";
    const hash = info.location?.hash ?? "";
    const state = info.location?.state ?? null;
    const key = info.location?.key ?? "";

    // React Router
    const params = info.params ?? {};
    const pattern = info.pattern ?? "";

    // React Error Boundary
    const componentStack = info?.errorInfo?.componentStack ?? "";
    
    // JS Error
    const name = error?.name ?? "Error";
    const message = error?.message ?? String(error);
    const stack = error?.stack ?? "";

    // Route Code
    const routeName =
        pathname
            .split("/")
            .filter(Boolean)
            .join("_")
            .toUpperCase() || "UNKNOWN";

    const ErrorReport = {
        key,

        where: {
            pathname,
            search,
            hash,
            state,
            params,
            pattern,
        },

        error: {
            name,
            message,
            stack,
            code: `ERR_RENDER_${routeName}`,
            status: "runtime-error",
        },

        trace: {
            componentStack,
        },

        metadata: {
            timestamp: Date.now(),
            context: `Route ${pathname || "/"}`,
            retryable: isRetryable(error),
            severity: getSeverity(error),

            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
            },

            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
            },

            url: window.location.href,
        },
    };
    
    console.log(ErrorReport)

    // TODO: reportToErrorService(ErrorReport);
};

export default errorHandler;