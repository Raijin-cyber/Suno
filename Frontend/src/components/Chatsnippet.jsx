import { useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../services/requestServices";
import { sendNotification } from "../services/notificationServices";

const Chatsnippet = ({ conversationId, userID, recipientAvatar, recipientName, conversationData }) => {
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
        if(userData) {
            console.log("UserData", userData);
            sendRequest(userData._id, userID)
            .then(async(req) => {
                setRequestBtnState(true);
                await sendNotification(userID, "request", req._id);
            })
            .catch((error) => {
                setRequestBtnState(false)
            });
        }
    }

    return(
        <div onClick={roomHandler} className={`backdrop-blur-[1.5px] bg-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.1)] flex items-center justify-between w-full p-2 rounded-2xl transition duration-100 ${conversationId && "hover:bg-black/20 active:bg-black/20"}`}>
            <div className="flex items-center gap-3 w-[85%]">
                {/* Avatar */}
                <div className="w-12">
                    <img src="/assets/icons/user.png" />    
                </div>    

                {/* Main Content */}
                <div className="flex flex-col flex-1 items-start min-w-0">
                    <p className="font-semibold">{recipientName}</p>
                    <p className="text-[0.85rem] line-clamp-1 break-all">
                        {conversationData?.lastMessage || <i>No messages to show</i>}
                    </p>
                </div>
            </div>

            {/* Time and unread messages and notification button */}
            <div className="flex flex-col min-w-[20%] items-end gap-y-2">
                {!conversationId &&
                    <button disabled={requestBtnState} onClick={requestHandler} className={`${requestBtnState ? "bg-transparent text-black border-2" : "bg-gray-800 text-white border-none"} xl:min-w-25 p-2 rounded-2xl text-[0.8rem]`}>{requestBtnState ? "Requested" : "Send Request"}</button>
                }
                
                {conversationData && <span className="text-xs">{conversationData.lastMessageTime}</span>}
                {conversationData?.unreadCount && <span className=" backdrop-blur-lg backdrop-saturate-180 bg-[rgba(33,50,28,0.75)] border border-[rgba(255,255,255,0.125)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-full w-5 h-5 flex items-center justify-center text-white text-[0.6rem]">{conversationData?.unreadCount}</span>}
            </div>

        </div>
    )
}

export default Chatsnippet;