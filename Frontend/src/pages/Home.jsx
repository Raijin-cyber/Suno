import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import { useScreenWidth } from "../hooks/useScreenWidth";
import { getCurrentUser, logoutUser } from "../services/authServices";
import { login, logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Chatsnippet from "../components/Chatsnippet";
import Silk from "../React-Bites Components/Silk";


const Home = () => {
    const [ alert, setAlert ] = useState(true);
    const socket = useSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const screenWidth = useScreenWidth();
    const isConversationOpen = location.pathname !== "/home"
    const showPlaceholder = !isConversationOpen && screenWidth >= 768;
    console.log(screenWidth)

    const logoutHandler = () => {
        logoutUser()
        .then((response) => {
            socket.disconnect();
            dispatch(logout());
            navigate("/");
            console.log("User logged out successfully");
        });
    }

    const recipientName = ["Sejal", "Sejal", "Sejal", "Sejal", "Sejal", "Sejal", "Sejal", "Sejal", "Sejal", "Sejal", "Sejal", "Sejal", "Sejal", "Sejal"];

    return (
        <div className="h-screen flex relative">
            {/* Conversations pane */}
            <div className="h-screen flex flex-col gap-y-5 px-4 py-3 w-full md:w-[40%] lg:w-[30%]">
            
                <div className="min-w-full relative flex flex-col items-center [mask-image:radial-gradient(circle,_white_95%,_transparent_100%)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover] rounded-3xl">
                    {/* React-Bite Component */}
                    <Silk
                        speed={2.9}
                        scale={1.2}
                        color="#de829a"
                        noiseIntensity={2}
                        rotation={1.21}
                    />

                    {/* This is CHAT BAR */}
                    <div className="px-2 absolute top-2 flex justify-between items-end w-full text-[#e5e5e5]">            
                        <div className="rounded-2xl p-2 flex flex-col items-start backdrop-blur-[5px] backdrop-saturate-125 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.125)]">
                            <span className="font-medium tracking-tight">Good evening,</span>
                            <span className="font-medium text-xl tracking-tight">Ujjwal Sharma</span>
                        </div>
                        <div className="rounded-2xl p-2 flex items-center gap-x-2 backdrop-blur-[5px] backdrop-saturate-125 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.125)]">
                            <button className="w-8" onClick={logoutHandler}><img className="active:bg-white/20 rounded-full p-1 transition duration-75" src="/assets/icons/exit.png" /></button>
                            <div className="w-8"><img onClick={() => setAlert(prev => !prev)} className="active:bg-white/20 rounded-full p-1 transition duration-75" src={`/assets/icons/${alert ? "ring" : "silent"}.png`} /></div>
                            <div className="w-8"><img className="active:bg-white/20 rounded-full p-1 transition duration-75" src="/assets/icons/dots.png" /></div>
                        </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="absolute bottom-2 w-full px-2">
                        <input className="text-[#e5e5e5] backdrop-blur-[5px] backdrop-saturate-125 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.125)] p-4 rounded-3xl w-full px-4 py-2 text-md focus:outline-none" type="text" placeholder="Search" />
                    </div>
                </div>
                
                {/* Chat Snippet List */}
                <div className="scrollbar-hide relative overflow-auto overflow-x-hidden rounded-xl p-4 bg-[#fc94af] shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4]">
                    <div className="cursor-pointer flex flex-col gap-y-3 w-full">
                        {recipientName.map((recipient, index) => (
                            <Chatsnippet key={index} recipientName={recipient} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="border-b-2 w-full mt-3"></div>
                    <p className="text-center font-light">All Chats are End-to-End Encrypted</p>
                </div>
            </div>

            {/* message pane */}
            {(isConversationOpen || screenWidth >= 768) &&
                <div className="overflow-hidden scrollbar-hide absolute max-md:h-screen max-md:w-screen md:relative md:block md:w-[70%] md:shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4] md:m-3 rounded-3xl bg-[#fc94Af]">
                
                    {/* Message when no conversation is opened */}
                    {showPlaceholder &&
                        <div className="hidden md:flex flex-col items-center gap-y-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-[40%] px-5">
                            <img src="/assets/illustrations/Light bulb-cuate.png" alt="" />
                            <p className="text-center font-light mb-5">Tip: Select a conversation to see its chats here.</p>
                        </div>
                    }
                    
                    {/* Chats */}
                    <div className="h-full w-full p-5 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide">
                        <Outlet />
                    </div>
                
                </div>
            }
        </div>
    )
}

export default Home;
