import { useSelector } from "react-redux";
import { sendMessage } from "../socket/chat";
import { useSocket } from "../hooks/useSocket";
import { useState, useCallback, useRef, lazy, Suspense, useEffect } from "react";
import { emitTypingEvent, emitNotTypingEvent } from "../socket/typing";

// Lazy components
const EmojiPicker = lazy(() => import("./EmojiPicker/EmojiPicker"));

const MessageComposer = ({conversationPane, conversationId, referenceMessage, setReferenceMessage}) => {
    const socket = useSocket()
    const typingTimeout = useRef()
    const messageTypingArea = useRef(null)
    const userData = useSelector(state => state.auth.userData);
    const [emojiPickerState, setEmojiPickerState] = useState(false);
    const [emojiVisibleState, setEmojiVisibleState] = useState(false);
    
    const clearReference = useCallback(() => {
      setReferenceMessage(null)
    }, []) 
    const emojiStateHandler = useCallback(() => {
      setEmojiVisibleState(prev => !prev);
      setTimeout(() => {
        setEmojiPickerState(prev => !prev)
      }, 100) 
    }, [])
    const handleTypingEvent = useCallback(() => {
      emitTypingEvent(socket, {conversationId: conversationId, userId: userData?._id || ''});
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        emitNotTypingEvent(socket, {conversationId: conversationId, userId: userData?._id || ''});
      }, 3000)
    }, [conversationId]) 
    const submitOnEnter = useCallback((e) => {
      if(e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.currentTarget.form.requestSubmit();
      }
    }, [])
    const sendMessageHandler = useCallback((e) => {
        e.preventDefault();
        conversationPane?.scrollTo({ top: conversationPane.scrollHeight, behavior: "smooth" });
        if(!messageTypingArea.current.value.trim()) return;      
        sendMessage(socket, { 
          conversationId: conversationId, 
          message: messageTypingArea.current.value, messageCreator: userData?.username, 
          referenceMessageId: referenceMessage?.id, 
          referenceMessage: referenceMessage?.message,
          referenceMessageCreator: referenceMessage?.creator, 
        });
        messageTypingArea.current.value = '';
        setReferenceMessage(null);
    }, [messageTypingArea, conversationId, referenceMessage])
    return(
        <>
            {/* Emoji Picker */}
            <Suspense fallback={null}>
              <EmojiPicker
                  emojiPickerState={emojiPickerState} 
                  setEmojiPickerState={setEmojiPickerState}
                  emojiVisibleState={emojiVisibleState}
                  setEmojiVisibleState={setEmojiVisibleState}
                  conversationId={conversationId}
                  messageCreator={userData?.username || ''}
                  referenceMessage={referenceMessage}
              />
            </Suspense>

            {/* Add button */}
            <button 
            className="
                hover:scale-105 active:scale-95
                my-2 cursor-pointer self-end transition duration-120 p-2 flex justify-center items-center rounded-full 
                backdrop-blur-[1.5px] bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]
            "
            >
            <img className="w-9" src="/assets/icons/plus.png" alt="add" />
            </button>

            <div className="w-full rounded-3xl flex flex-col backdrop-blur-[1.5px] bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)] overflow-hidden">

            {/* Reference Message */}
            <div className={`
                overflow-hidden animate-ease-in
                transition-all animate-duration-200 relative rounded-2xl
                backdrop-blur-[18px] backdrop-saturate-150 bg-black/25 border border-white/10
                ${
                    referenceMessage
                    ? "max-h-40 opacity-100 mx-2 mt-2 px-3 py-2"
                    : "animate-ease-out max-h-0 opacity-0"
                }  
                
                `}>

                {/* button for removing reference message from the sending area */}
                <button onClick={clearReference} className="absolute top-1 right-1 hover:bg-white/35 bg-white/50 rounded-full p-1"><img className="w-5" src="/assets/icons/cross_black.png" alt="cut" /></button>

                <p 
                id="referenceMessageArea"
                className="
                text-sm
                overflow-hidden
                line-clamp-3
                md:line-clamp-4
                wrap-break-words
                ">
                {referenceMessage?.message}
                </p>

            </div>

            {/* Typing Area */}
            <form
                onSubmit={sendMessageHandler}
                className="flex items-center w-full gap-x-1 p-2"
            > 
                {/* Emoji Picker button */}
                <img 
                className="w-9 hover:scale-105 active:scale-95 transition-all duration-200" 
                src="/assets/icons/add-emoji.svg" 
                alt="add-emoji"
                onClick={emojiStateHandler}
                />

                <textarea
                ref={messageTypingArea}
                onChange={handleTypingEvent}
                onKeyDown={submitOnEnter}
                rows={1}
                className="
                    resize-none scrollbar-hide text-[1.10rem]
                    pl-4 py-3 outline-none w-full bg-transparent max-h-32
                "
                placeholder="Type a message"
                name="messageArea"
                />

                {/* Send button */}
                <button
                type="submit"
                className="active:scale-95 hover:scale-105 cursor-pointer bg-[#FF70BF] transition duration-120 rounded-full p-3 flex items-center justify-center"
                >
                <img
                    className="w-6"
                    src="/assets/icons/send.png"
                    alt="send"
                />
                </button>
            </form>

            </div>
        </>
    )
}

export default MessageComposer;