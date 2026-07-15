import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { sendRequest } from "../../services/requestServices";
import { sendNotification } from "../../services/notificationServices";

const Chatsnippet = ({ userData=null, recipientID=null, recipientAvatar=null, recipientName=null,  conversationId=null, conversationData=null, setError }) => {
    const navigate = useNavigate();
    const [ requestBtnState, setRequestBtnState] = useState(false);

    const regex = /(\/emojis library\/([^/]+)\/([A-Za-z0-9-]+)_u([a-f0-9_]+)\.json)&([\p{Emoji}\u200d\ufe0f]+)/giu;

    // This function takes the user to conversation page
    const roomHandler = useCallback(() => {
        if(!conversationId) return;
        navigate(`/home/convo/${conversationId}`);
    }, [conversationId])

    // this function created a chat request and send a notification to the user
    const requestHandler = useCallback(async() => {
        sendRequest(userData?._id, recipientID)
        .then((res) => {
            const requestId = res?.result._id;
            setRequestBtnState(true);
            sendNotification(recipientID, "request", requestId).then(() => setRequestBtnState(false));
        })
        .catch((error) => setError(error))
    }, [userData]);

    const extractLastEmoji = (text) => {
        const graphemes = [...new Intl.Segmenter("en", {
            granularity: "grapheme",
        }).segment(text)];

        return graphemes.at(-1)?.segment ?? "";
    };

    return(
        <div onClick={roomHandler} className={`backdrop-blur-[1.5px] bg-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.1)] flex items-center justify-between w-full p-2 rounded-2xl transition duration-100 ${conversationId && "hover:bg-black/20 active:bg-black/20"}`}>
            <div className="flex items-center gap-3 w-[85%]">
                {/* Avatar */}
                <div className="w-12">
                    {recipientAvatar ? <img src={recipientAvatar} alt="avatar" /> : <img src={`/avatars/${recipientName[0].toUpperCase()}.png`} alt="avatar"/>}    
                </div>    

                {/* Main Content */}
                <div className="flex flex-col flex-1 items-start min-w-0">
                    <p className="font-semibold">{recipientName}</p>
                    {conversationData?.lastMessage
    ? (
        <>
                        {regex.test(conversationData.lastMessage)
                            ? extractLastEmoji(conversationData.lastMessage)
                            : conversationData.lastMessage}
                        </>
                    )
                    : <i>No messages to show</i>}
                </div>
            </div>

            {/* Time and unread messages and notification button */}
            <div className="flex flex-col min-w-[20%] items-end gap-y-2">
                {!conversationId &&
                    <button 
                        disabled={requestBtnState} 
                        onClick={requestHandler} 
                        className={` 
                            bg-[#0A2947] text-white cursor-pointer
                            xl:min-w-25 px-2 py-3 rounded-xl text-[0.8rem]    
                        `}
                    >
                            {requestBtnState ? "Requested" : "Request"}
                    </button>
                }
                
                {conversationData && <span className="text-xs">{conversationData.lastMessageTime}</span>}
                {conversationData?.unreadCount && <span className=" backdrop-blur-lg backdrop-saturate-180 bg-[rgba(33,50,28,0.75)] border border-[rgba(255,255,255,0.125)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-full w-5 h-5 flex items-center justify-center text-white text-[0.6rem]">{conversationData?.unreadCount}</span>}
            </div>

        </div>
    )
}

export default Chatsnippet;