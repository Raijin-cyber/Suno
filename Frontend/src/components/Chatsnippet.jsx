import { useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import { roomJoinEvent } from "../socket/chat";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../services/requestServices";

const Chatsnippet = ({conversationId, userID, recipientAvatar, recipientName, lastMessage, lastMessageTime, UnreadMessageCount}) => {
    const socket = useSocket();
    const navigate = useNavigate();
    const userData = useSelector((state) => {return state.auth.userData});
    const [ requestBtnState, setRequestBtnState] = useState(false);

    // This function takes the user to conversation page
    const roomHandler = () => {
        if(!conversationId) return;
        navigate(`/home/convo/${conversationId}`);
    }

    // this function created a chat request and send a notification to the user
    const requestHandler = async() => {
        sendRequest(userData.user_id, userID)
        .then((req) => {
            setRequestBtnState(true);
            console.log(req);
        })
        .catch(() => setRequestBtnState(false));

    }

    return(
        <div onClick={roomHandler} className={`backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.1)] flex items-center justify-between w-full p-2 rounded-2xl transition duration-100 ${conversationId && "hover:bg-black/20 active:bg-black/20"}`}>
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-auto">
                    <img src="/assets/icons/user.png" />    
                </div>    

                {/* Main Content */}
                <div className="flex flex-col">
                    <p className="font-semibold">{recipientName}</p>
                    <p className="text-[0.85rem]">{lastMessage && lastMessage}</p>
                </div>
            </div>

            {/* Time and unread messages */}
            <div className="flex flex-col items-end justify-center">
                {!conversationId &&
                    <button onClick={requestHandler} className={`${requestBtnState ? "bg-transparent text-black border-2" : "bg-gray-800 text-white border-none"} xl:min-w-25 p-2 rounded-2xl text-[0.8rem]`}>{requestBtnState ? "Requested" : "Send Request"}</button>
                }

                {
                    (!lastMessage && !UnreadMessageCount) && <div className="bg-"></div>
                }
                
                {lastMessage && <span className="text-xs">{lastMessageTime && lastMessageTime}</span>}
                {UnreadMessageCount && <span className=" backdrop-blur-lg backdrop-saturate-180 bg-[rgba(33,50,28,0.75)] border border-[rgba(255,255,255,0.125)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">{UnreadMessageCount && UnreadMessageCount}</span>}
            </div>

        </div>
    )
}

export default Chatsnippet;