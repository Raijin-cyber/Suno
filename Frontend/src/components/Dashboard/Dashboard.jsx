import HelloSky from "./HelloSky";
import { useSelector } from "react-redux";
import Ellipsis from "../Ellipsis/Ellipsis";
import greetUser from "../../utils/greetUser";
import { resetStore } from "../../store/storeFn";
import { useSocket } from "../../hooks/useSocket";
import Silk from "../../React-Bites Components/Silk";
import { logoutUser } from "../../services/authServices";
import { useNavigate, useParams } from "react-router-dom";
import { readNotification } from "../../services/notificationServices";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const Dashboard = ({ setIsNotifiOpen, setQuery, setError }) => {
    const timerRef = useRef();
    const socket = useSocket();
    const { mode } = useParams();
    const navigate = useNavigate();
    const ellipsisBtnRef = useRef();
    const longPressTriggered = useRef();
    const [alert, setAlert] = useState(true);
    const [ellipsisState, setEllipsisState] = useState(false);
    const userData = useSelector((state) => state.auth.userData);
    
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
            socket.disconnect();      
            resetStore();           
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
                <Silk
                    speed={2.9}
                    scale={1.2}
                    color="#de829a"
                    noiseIntensity={2}
                    rotation={1.21}
                />
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
                    <div className="cursor-pointer hover:scale-120 transition-all duration-300 w-8"><img onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onClick={handleClick} className="active:bg-white/20 rounded-full p-1 transition-all duration-75" src={`/assets/icons/${alert ? "ring" : "silent"}.png`} /></div>

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