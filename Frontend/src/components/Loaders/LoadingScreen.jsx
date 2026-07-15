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
                    <img className="animate-float animate-iteration-count-infinite animate-duration-2000 w-50" src="/logos/app_icon.png" alt="logo" />
                </div>
            }
            {child}
        </div>
    )

}

export default LoadingScreen;