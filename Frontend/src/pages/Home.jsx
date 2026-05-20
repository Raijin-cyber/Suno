import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import { getCurrentUser, logoutUser } from "../services/authServices";
import { login, logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Chatsnippet from "../components/Chatsnippet";


const Home = () => {
    const [ alert, setAlert ] = useState(true);
    const socket = useSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            <div className="h-screen flex flex-col gap-y-5 px-4 py-3 md:w-[30%]">
            
                <div className="flex flex-col space-y-5">
                    {/* This is CHAT BAR */}
                    <div className="flex justify-between items-center">            
                        <div className="flex flex-col items-start">
                            <span className="font-medium tracking-tight">Good evening,</span>
                            <span className="font-medium text-xl tracking-tight">Ujjwal Sharma</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <button className="w-8" onClick={logoutHandler}><img className="active:bg-black/20 rounded-full p-1 transition duration-75" src="/assets/icons/exit.png" /></button>
                            <div className="w-8"><img onClick={() => setAlert(prev => !prev)} className="active:bg-black/20 rounded-full p-1 transition duration-75" src={`/assets/icons/${alert ? "ring" : "silent"}.png`} /></div>
                            <div className="w-8"><img className="active:bg-black/20 rounded-full p-1 transition duration-75" src="/assets/icons/dots.png" /></div>
                        </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="w-full">
                        <input className="backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)] p-6 shadow-lg rounded-3xl w-full px-4 py-2 text-md focus:outline-none" type="text" placeholder="Search" />
                    </div>
                </div>
                
                {/* Chat Snippet List */}
                <div className="scrollbar-hide relative overflow-auto overflow-x-hidden rounded-xl p-4 bg-[#fc94af] shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4]">
                    <div className="flex flex-col gap-y-3 w-full">
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
            <div className="w-[70%] shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4] m-3 rounded-3xl">
                        sdf
            </div>
        </div>
    )
}

export default Home;
