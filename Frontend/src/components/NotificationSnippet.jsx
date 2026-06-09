import { useState } from "react";
import { createConversation } from "../services/conversationServices";
import { acceptRequest, deleteRequest } from "../services/requestServices"

const NotificationSnippet = ({notificationContent, requestNotification}) => { 
    const [requestStatus, setRequestStatus] = useState(notificationContent.requestID.status === "accepted");

    const acceptRequestHandler = async() => {
        // @params:  request id and user id
        acceptRequest(notificationContent.requestID)
        .then(async(request) => {await createConversation("direct", notificationContent.sender._id)});
        setRequestStatus(true);
    }

    const deleteRequestHandler = () => {
        
    }

    return (
        <div className="w-full">
            {
                requestNotification &&
                <div className="flex items-center justify-between w-full animated-gradient-1 p-4 rounded-2xl border border-black/10 shadow-2xl">

                    <div className="flex items-center gap-x-3 w-full">
                        <div className="w-12 h-auto">
                            <img src={notificationContent.sender.avatar ? "" : "/assets/icons/user.png"} />    
                        </div>
                        <p className="grow w-[50%] md:w-[60%] text-[0.9rem]">{`${notificationContent.sender.username} wants to connect with you.`}</p>
                    </div>

                    <div className="flex items-center justify-end gap-x-1 w-[35%]">
                        <button disabled={requestStatus} onClick={acceptRequestHandler} className={`px-2 text-sm text-center text-[#e5e5e5] border py-1 backdrop-blur-md backdrop-saturate-134 bg-[rgba(0,0,0,0.8)] ${!requestStatus && "active:bg-[rgba(76,77,79,0.8)]"} rounded-lg transition duration-75 border-[rgba(255,255,255,0.125)]`}>{requestStatus ? "Confirmed" :"Confirm"}</button>
                        {!requestStatus && <button onClick={deleteRequestHandler} className="min-w-6 max-w-6 active:bg-black/20 rounded-full transition duration-75"><img src="/assets/icons/cross_black.png" alt="black cross" /></button>}
                    </div>
                
                </div>
            }
        </div>
    )
}

export default NotificationSnippet;