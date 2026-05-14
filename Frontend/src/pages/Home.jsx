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
        <div className="flex flex-col gap-y-3 px-4 py-3">
            
            {/* This is CHAT BAR */}
            <div className="flex justify-between items-center">
                <span className="text-3xl lg:text-5xl font-semibold font-sans">Chats</span>
                <div className="flex gap-x-2 h-9 lg:h-12 w-auto">
                    <button onClick={logoutHandler}><img className="active:bg-black/20 rounded-full p-1 transition duration-75" src="/assets/icons/exit.png" /></button>
                    <img onClick={() => setAlert(prev => !prev)} className="active:bg-black/20 rounded-full p-1 transition duration-75" src={`/assets/icons/${alert ? "ring" : "silent"}.png`} />
                    <img className="active:bg-black/20 rounded-full p-1 transition duration-75" src="/assets/icons/dots.png" />
                </div>
            </div>
            
            {/* This is SEARCH BAR */}
            <div className="w-full">
                <input className="bg-gray-600/30 rounded-4xl w-full px-4 py-2 text-md focus:outline-none" type="text" placeholder="Search" />
            </div>
            
            {/* Chat Snippet List */}
            <div className="flex flex-col gap-y-1 w-full">
                {recipientName.map((recipient, index) => (
                    <Chatsnippet key={index} recipientName={recipient} />
                ))}
            </div>

            <div>
                <div className="border-b-2 w-full mt-3"></div>
                <p className="text-center font-light">All Chats are End-to-End Encrypted</p>
            </div>
        </div>
    )
}

export default Home;
