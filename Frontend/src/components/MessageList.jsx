import Chat from "./Chat";
import { memo } from "react";
import { useOutletContext } from "react-router-dom";

const MessageList = memo(({
    conversationMessages,
    referenceMessage,
    setReferenceMessage,
    conversationContext,
    participant
}) => {
    return(
        conversationMessages?.map((m) => (
            <Chat 
                time={m.time}
                isOwn={m.isOwn}
                key={m.messageId}
                msgId={m.messageId}
                msg={m.message}
                creator={m.messageCreator}
                referenceMsg={m.referenceMessage}
                referenceMessageCreator={m.referenceMessageCreator}
                setReferenceMessage={setReferenceMessage}
                convoType={conversationContext?.convoType || "group"}
                readReceipt={m.readByAt?.some(
                    c => 
                        c.readerId === participant?._id || 
                        c.userId === participant?._id
                )} 
            />
        ))
    )
})

export default MessageList;