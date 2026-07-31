import { useEffect } from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    useEffect(() => {
        console.error("Error Boundary caught:", error);
    }, [error]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-6">
            <div className="flex flex-col items-center max-w-3xl w-full rounded-xl shadow-lg p-4 text-center">
                <img loading="lazy" className="w-25" src="/assets/illustrations/sad-guy.png" alt="sad_guy" />

                <h1 className="text-2xl font-bold text-gray-900">
                    Sorry, it's from our side
                </h1>

                <p className="mt-2 text-gray-600">
                    An unexpected error occurred while rendering this page.
                </p>

                <div className="w-[95%] mt-6 rounded-lg bg-gray-900 text-green-400 text-left p-4 overflow-auto max-h-60 scrollbar-hide">
                    <p className="font-semibold mb-2">
                        {error?.name || "Error"}
                    </p>

                    <p className="wrap-break-words">
                        {error?.message || "Unknown error"}
                    </p>

                    {import.meta.env.DEV && error?.stack && (
                        <pre className="mt-4 whitespace-pre text-xs">
                            {error.stack}
                        </pre>
                    )}
                </div>

                <div className=" flex items-center gap-x-10">
                    <button
                        onClick={resetErrorBoundary}
                        className="mt-6 px-5 py-2 rounded-lg bg-[#aa336a] text-white hover:scale-105 active:scale-105 transition-all duration-200"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-5 py-2 rounded-lg bg-[#aa336a] text-white hover:scale-105 active:scale-105 transition-all duration-200"
                    >
                        Reload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorFallback;