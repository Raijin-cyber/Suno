import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, memo } from "react";
import { sendNotification } from "../../services/notificationServices";
import { createConversation } from "../../services/conversationServices";
import { acceptRequest, deleteRequest } from "../../services/requestServices";

const RequestNotification = memo(({ conversationRefresh, notificationContent, userData }) => {
    const [requestStatus, setRequestStatus] = useState(notificationContent?.requestID?.status === "accepted");

    const handleProfileNavigation = useCallback(() => {
        navigate();
    }, [notificationContent]);

    const acceptRequestHandler = useCallback(async() => {
        acceptRequest(notificationContent?.requestID)
        .then(async(request) => {
            conversationRefresh();
            await createConversation("direct", notificationContent?.sender._id);
        });
        setRequestStatus(true);
    }, [notificationContent, userData]);

    const deleteRequestHandler = useCallback(async() => {
        await deleteRequest(notificationContent?.requestID, userData?._id);
    }, [notificationContent, userData]);

    return (
        <div className="flex items-center justify-between w-full">

            <div className="flex items-center gap-x-3 w-full">
                {/* avatar */}
                <img 
                    onClick={handleProfileNavigation}
                    className="cursor-pointer w-9 md:w-12" 
                    src={notificationContent?.sender.avatar || `/avatars/${notificationContent?.sender.username[0].toUpperCase()}.png`} 
                />    

                {/* Content */}
                <div className="flex flex-col items-start gap-y-1 w-[80%] md:w-[70%]">
                    <span className="font-semibold text-[0.8rem] md:text-sm">Conversation Request</span>
                    <p className="w-full line-clamp-2 text-[0.8rem] md:text-xs">{`${notificationContent?.sender.username} wants to connect with you.`}</p>
                </div>
            </div>

            {/* time when it was received */}
            <span className="absolute bottom-1.5 right-4 text-white/40 text-[0.7rem]">4s ago</span>

            {/* actions */}
            {!requestStatus ?
                <div className="flex flex-col md:flex-row md:items-center md:justify-end md:gap-x-2 gap-y-2">
                    <button 
                        disabled={requestStatus} 
                        onClick={acceptRequestHandler} 
                        className={`hover:scale-103 active:scale-98 transition-all duration-100 w-17 md:text-sm text-xs text-center text-[#e5e5e5] p-1.5 bg-[#ae2a5e] rounded-lg cursor-pointer`}
                    >
                        Confirm
                    </button>
                    
                    <button 
                        disabled={requestStatus} 
                        onClick={deleteRequestHandler} 
                        className={`hover:scale-103 active:scale-98 transition-all duration-100 w-17 md:text-sm text-xs text-center text-[#e5e5e5] p-1.5 bg-[#545454] rounded-lg cursor-pointer`}
                    >
                        Delete
                    </button>
                </div> :
                <span className="text-sm bg-gray-800 rounded-lg pr-2 text-center p-2">Confirmed</span>
            }
        
        </div>
    )
})

const MessageNotification = memo(({  notificationContent, userData }) => {
    return (
        <>Meesage</>
    )
})

const NotificationSnippet = ({ conversationRefresh, notificationContent, requestNotification=false, messageNotification=false }) => { 
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    return (
        <div className="relative w-full bg-black/70 px-3 py-6 md:py-5 rounded-2xl text-white/90">
            
            {
                requestNotification &&
                <RequestNotification 
                    notificationContent={notificationContent}
                    conversationRefresh={conversationRefresh}
                    userData={userData}
                />
            }

            {
                messageNotification &&
                <MessageNotification 
                    notificationContent={notificationContent}
                    userData={userData}
                />
            }

        </div>
    )
}

export default NotificationSnippet;