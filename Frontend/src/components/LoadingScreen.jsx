import { useEffect, useState } from "react";

const LoadingScreen = ({ child }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTimeout = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => {
            clearTimeout(loadTimeout);
        }
    }, [])

    // loading screen
    return (
        <div>
            {loading && 
                <div className="fixed flex justify-center items-center w-screen h-screen bg-[#fc94Af] z-50">
                    <p className="text-9xl gradient-text font-extrabold animate-pulse p-5">Orbi</p>
                </div>
            }
            {child}
        </div>
    )

}

export default LoadingScreen;