import HelloSky from "./HelloSky";
import { useSelector } from "react-redux";
import Ellipsis from "../Ellipsis/Ellipsis";
import { resetStore } from "../../store/storeFn";
import { useSocket } from "../../hooks/useSocket";
import { logoutUser } from "../../services/authServices";
import { useNavigate, useParams } from "react-router-dom";
import { readNotification } from "../../services/notificationServices";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

const Silk = lazy(() => import("../../React-Bites Components/Silk"));

const Dashboard = ({ 
    userData=null, 
    setIsNotifiOpen, 
    setQuery, 
    setError 
}) => {
    const socket = useSocket();
    const { mode } = useParams();
    const timerRef = useRef(null);
    const navigate = useNavigate();
    const ellipsisBtnRef = useRef(null);
    const longPressTriggered = useRef(null);
    const [alert, setAlert] = useState(true);
    const [isDynamicAnim, SetIsDynamicAnim] = useState(false);
    const [ellipsisState, setEllipsisState] = useState(false);
    
    const handleMouseDown = useCallback(() => {
        longPressTriggered.current = false;
        timerRef.current = setTimeout(() => {
            setAlert(prev => !prev);
            longPressTriggered.current = true;
        }, 1000);
    }, []);
    const handleMouseUp = useCallback(() => {
        clearTimeout(timerRef.current);
    }, []);
    const handleClick = useCallback(async() => {
        if(longPressTriggered.current) {
            // logic
            return;
        }
        setIsNotifiOpen(true);
        await readNotification();
    }, []);
    const logoutHandler = useCallback(() => {
        logoutUser()
        .then(() => {
            setTimeout(() => {
                socket.disconnect();      
                resetStore();
            }, 5000);           
        })
        .catch((error) => setError(error))
        .finally(() => navigate("/"));
    }, []);

    return(
        <div 
            className="
                relative
                min-w-full flex flex-col 
                rounded-3xl items-center
            "
        >
            
            {/* React-Bite Component */}
            <div 
                className=" 
                    max-w-full min-w-full
                    mask-no-repeat mask-center mask-cover rounded-3xl
                    mask-[radial-gradient(circle,white_95%,transparent_100%)] 
                "
            >
                {isDynamicAnim ?
                    <Suspense fallback={null}>
                        <Silk
                            speed={2.9}
                            scale={1.2}
                            color="#de829a"
                            noiseIntensity={2}
                            rotation={1.21}
                        />
                    </ Suspense>
                    :
                    <img 
                        className="h-38 w-full min-w-md saturate-85" 
                        src="/backgrounds/silk_background.webp" 
                        alt="silk_background" 
                    />
                }
            </div>
            

            <div className="px-2 absolute top-2 flex justify-between items-end w-full text-[#e5e5e5]">            
                
                {/* Greetings and Weathers */}
                <HelloSky userData={userData} />

                {/* Control panel */}
                <div
                    id="ControlPanel" 
                    className="
                        absolute top-7 right-2 z-10
                        rounded-2xl p-2 flex items-center 
                        gap-x-2 backdrop-blur-[5px] backdrop-saturate-125 
                        bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.125)]
                    "
                >

                    {/* Logout button */}
                    <button className="cursor-pointer hover:scale-120 transition-all duration-300 w-8" onClick={logoutHandler}><img className="active:bg-white/20 rounded-full p-1 transition-all duration-75" src="/assets/icons/exit.png" /></button>

                    {/* Mute/Unmute button and Notification toggle */}
                    <div className="relative cursor-pointer hover:scale-120 transition-all duration-300 w-8">
                        <img 
                            onMouseDown={handleMouseDown} 
                            onMouseUp={handleMouseUp} 
                            onMouseLeave={handleMouseUp} 
                            onTouchStart={handleMouseDown} 
                            onTouchEnd={handleMouseUp} 
                            onClick={handleClick} 
                            className="active:bg-white/20 rounded-full p-1 transition-all duration-75" 
                            src={`/assets/icons/${alert ? "ring" : "silent"}.png`} 
                        />
                        <span className="absolute top-1 left-1 border-5 border-red-600 rounded-full"></span>
                    </div>

                    {/* Settings floating menu */}
                    <div 
                        ref={ellipsisBtnRef} 
                        onClick={() => setEllipsisState(prev => !prev)} 
                        className="cursor-pointer hover:scale-120 transition-all duration-300 w-8">
                            <img className="active:bg-white/20 rounded-full p-1 transition-all duration-75" src="/assets/icons/dots.png" />
                    </div>
                    
                    {/* Ellipsis Menu */}
                    <Ellipsis 
                        ellipsisState={ellipsisState} 
                        setEllipsisState={setEllipsisState} 
                        ellipsisBtnRef={ellipsisBtnRef}
                    />
                    
                </div>

            </div>
            
            {/* Search Bar */}
            <div className="
                flex items-center gap-x-4
                absolute bottom-2 w-[96%] px-4 rounded-3xl
                backdrop-blur-[5px] backdrop-saturate-125 
                bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.125)]
            ">
                <input 
                    onChange={(e) => setQuery(e.target.value)} 
                    className="text-[#e5e5e5] py-2 text-md focus:outline-none w-full" 
                    type="text" 
                    placeholder={`${mode ? "Search username" : "Search conversation"}`} 
                />
                <i className="fa-solid fa-magnifying-glass text-[#e5e5e5]/30"></i>
            </div>

        </div>
    )
}

export default Dashboard;