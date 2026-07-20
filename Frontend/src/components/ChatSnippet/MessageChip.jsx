import { useCallback, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { sendMessage } from "../../socket/chat";
import RingCustom from "../Loaders/Ring";

const MessageChip = ({ customMessageHandler, senderName, conversationId, setIsChatDrawerOpen, message }) => {
    const socket = useSocket();
    let chatSendTimeout = useRef(null);
    const [loadingState, setLoadingState] = useState(false);

    const messageSendHandler = useCallback((e) => {
        e.stopPropagation();
        if(!conversationId) return;
        setLoadingState(true)
        sendMessage(socket,
            {
                conversationId,
                message,
                messageCreator: senderName
            }
        )
        
        // clear last timeout
        clearTimeout(chatSendTimeout);
        chatSendTimeout = setTimeout(() => {
            setLoadingState(false);
        }, 700)
    }, [conversationId, chatSendTimeout])

    return (
        <button 
            onClick={customMessageHandler || messageSendHandler}
            disabled={loadingState}
            className={`
                rounded-3xl px-2 py-1 cursor-pointer truncate ${loadingState ? "opacity-30" : "active:scale-95 active:bg-black/10"}
                text-[0.9rem] border-[1.7px] border-[#aa336a] min-h-8 max-h-10 max-w-40 min-w-10
                transition-all duration-50 font-semibold
            `}
        >
            {loadingState ?
               <div className="w-full text-center"><RingCustom /></div> :
                message || "--" 
            }
        </button>
    )
}

export default MessageChip;