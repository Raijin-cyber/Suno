import Chat from "../components/Chat";
import TypingIndicator from "../components/TypingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { clearUnreadMessages, resetUnread } from "../store/conversationsSlice"; 
import { updateMessage, setMessage } from "../store/messagesSlice";
import { sendMessage, joinRoom, leaveRoom, listenForMessages } from "../socket/chat";
import { useSocket } from "../hooks/useSocket";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

// socket related imports
import { emitOnlineEvent } from "../socket/presence";
import { emitTypingEvent, emitNotTypingEvent } from "../socket/typing";
import { emitMarkAsReadEvent } from "../socket/conversation";

const Conversation = () => {
    const { id } = useParams();
    const roomId = id;
    const conversationContext = useOutletContext();
    const userData = useSelector((state) => state.auth.userData) || {};
    const members = useSelector((state) => state.conversations.presence[roomId]) || [];
    const typingMembers = useSelector((state) => state.conversations.byId[roomId]?.typingUsers);
    const unreadMessages = useSelector((state) => state.conversations.byId[roomId]?.unreadMessages);
    const conversationMessages = useSelector(state => state.messages.byConversationId[roomId]) || [];
    const otherMemberFromContext = conversationContext?.members?.find(m => m._id !== userData._id);
    const otherMemberStatus = members?.find(m => m.userId !== userData?._id)?.status || "offline";
    const socket = useSocket();
    const dispatch = useDispatch();
    const bottomRef = useRef();
    const conversationPane = useRef();
    const navigate = useNavigate();
    const [closing, setClosing] = useState(false);
    
    // reference message
    const [referenceMessageId, setReferenceMessageId] = useState('');
    const [referenceMsg, setReferenceMsg] = useState('');
    const [referenceMsgCreator, setReferenceMsgCreator] = useState('');

    // message mark as read utilities
    const [lastReadAt, setLastReadAt] = useState('');

    useEffect(() => {
      if (!roomId || !userData?._id) return;
      joinRoom(socket, { conversationId: roomId });

      if(unreadMessages && unreadMessages.length > 0){
        unreadMessages?.forEach((unread) => {
          emitMarkAsReadEvent(socket, 
            { conversationId: roomId, 
              messageId: unread.messageId, 
              readerUsername: userData?.username, 
              readerId: userData?._id, 
              readTime: Date.now() 
            }
          );
        })
        // clear unread messages for this conversation
        dispatch(clearUnreadMessages({ conversationId: roomId }));
      }
      dispatch(resetUnread({ conversationId: roomId }));

      console.log(conversationMessages);
      
    }, [roomId, userData?._id, conversationMessages]);
      
    // this is a funcationality for UI
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages]);

    const sendMessageHandler = (e) => {
        e.preventDefault();
        const referenceMessageArea = document.getElementById("referenceMessageArea");
        
        if(e.target[0].value !== '') {
          const message =  e.target[0].value;
          const messageCreator = userData?.username;
          const referenceMessage = referenceMessageArea.innerText; 
          const referenceMessageCreator = referenceMsgCreator;

          // v.0.2
          sendMessage(socket, { 
            conversationId: roomId, 
            message, messageCreator, 
            referenceMessageId, referenceMessage, referenceMessageCreator 
          });
          
          e.target[0].value = "";
          setReferenceMsg('');
        }
    }

    const submissionHandler = (e) => {
      if(e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.currentTarget.form.requestSubmit();
      }
    }

    const handleCloseConversation = () => {
      setClosing(true);
      setTimeout(() => navigate(-1), 200);
    }

    // typing function handler
    let typingTimeout;
    const handleTypingEvent = () => {
      // user started typing -> emit immediately
      emitTypingEvent(socket, {conversationId: roomId, userId: userData?._id || ''});
      // resets the previous timer created on each keyStroke
      clearTimeout(typingTimeout);
      // set timer for 3 seconds, if user stays inactive then fire not typing event
      typingTimeout = setTimeout(() => {
        emitNotTypingEvent(socket, {conversationId: roomId, userId: userData?._id || ''});
      }, 3000)
    }
    
  return (
    <div ref={conversationPane} className={`${!closing ? "animate-slide-in-top" : "animate-fade-out-right animate-duration-200"} overflow-y-scroll scrollbar-hide animate-duration-100 relative flex flex-col h-full w-full p-5`}>
      
      {/* ####### Header ####### */}
      <div className="z-10 sticky top-0 flex items-center justify-between rounded-2xl py-2 px-4 backdrop-blur-[1.5px] bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-x-3">
              <div onClick={handleCloseConversation} className="md:hidden cursor-pointer rounded-full active:bg-black/20 transition duration-120 object-cover"><img src="/assets/icons/back.png" alt="" /></div>
              <div className="cursor-pointer rounded-full object-cover h-10 w-10 md:h-15 md:w-15"><img src="/assets/icons/user.png" alt="Panda" /></div>
              <div className="flex flex-col items-start">
                  <span className="text-[1.10rem] md:text-xl tracking-tight">{conversationContext?.convoType === "direct" ? otherMemberFromContext?.username : "Group"}</span>
                  <span className="text-[0.8rem] md:text-xs font-light tracking-tight">{otherMemberStatus}</span>
              </div>
          </div>
          <div className="flex items-center">
              <div className="cursor-pointer rounded-full active:bg-black/20 transition duration-120 p-2 object-cover"><img className="w-6 md:w-8" src="/assets/icons/video.png" alt="video" /></div>
              <div className="cursor-pointer rounded-full active:bg-black/20 transition duration-120 p-2 object-cover"><img className="w-6 md:w-8" src="/assets/icons/call.png" alt="call" /></div>
              <div className="cursor-pointer rounded-full active:bg-black/20 transition duration-120 p-2 object-cover"><img className="w-6 md:w-8" src="/assets/icons/dots_black.png" alt="dots" /></div>
          </div>
      </div>

      <div className="relative flex flex-col justify-center items-center">
        <img className="sm:w-90 md:w-100 lg:w-140" src="/assets/illustrations/Political debate-rafiki.png" alt="" />
        <p className="absolute -bottom-5 md:bottom-2 text-center font-light text-xl">Got something to say? Type it below!</p>
      </div>

      {/* ####### Chats ####### */}
      <div id="chat-area" className="relative w-full mt-12 flex-1 px-2">
        <div className={`flex flex-col gap-y-2 transition-all duration-300 ${typingMembers?.length > 0 ? "-translate-y-10" : "translate-y-0"}`}>
          {conversationMessages?.map((chat, index) => (
            <Chat key={index} msgId={chat.messageId} msg={chat.message} referenceMsg={chat.referenceMessage} creator={chat.messageCreator} referenceMsgCreator={chat.referenceMessageCreator} isOwn={chat.isOwn} time={chat.time} referenceMsgIdSetter={setReferenceMessageId} referenceMsgCreatorSetter={setReferenceMsgCreator} referenceMsgSetter={setReferenceMsg} convoType={conversationContext?.convoType || ''} readReceipt={chat.readByAt?.some(c => c.readerId === otherMemberFromContext?._id || c.userId === otherMemberFromContext?._id)} />
          ))}
        </div>
        <TypingIndicator isTyping={typingMembers?.length > 0} />
      </div>

      {/* Dummy DIV for bottom reference */}
      <div ref={bottomRef}></div>

      {/* ####### Sending Area ####### */}
      <div className="sticky bottom-0 w-full flex items-center justify-between gap-4 py-2">

        <button className="my-2 cursor-pointer self-end active:bg-black/20 transition duration-120 p-2 flex justify-center items-center rounded-full backdrop-blur-[1.5px] bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]">
          <img className="w-9" src="/assets/icons/plus.png" alt="add" />
        </button>

        <div className="w-full rounded-3xl flex flex-col backdrop-blur-[1.5px] bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)] overflow-hidden">

          {/* Reference Message */}
          <div className={`
              overflow-hidden animate-ease-in
              transition-all animate-duration-200
              relative  
              rounded-2xl backdrop-blur-[18px] 
              backdrop-saturate-150 bg-black/25 border border-white/10
              ${
                referenceMsg
                ? "max-h-40 opacity-100 mx-2 mt-2 px-3 py-2"
                : "animate-ease-out max-h-0 opacity-0"
              }  
            
            `}>

            {/* button for removing reference message from the sending area */}
            <button onClick={() => setReferenceMsg('')} className="absolute top-1 right-1 hover:bg-white/35 bg-white/50 rounded-full p-1"><img className="w-5" src="/assets/icons/cross_black.png" alt="cut" /></button>

            <p 
              id="referenceMessageArea"
              className="
              text-sm
              overflow-hidden
              line-clamp-3
              md:line-clamp-4
              wrap-break-words
            ">
              {referenceMsg}
            </p>

          </div>

          {/* Typing Area */}
          <form
            onSubmit={sendMessageHandler}
            className="flex items-center w-full p-2"
          >
            <textarea
              onChange={handleTypingEvent}
              onKeyDown={submissionHandler}
              rows={1}
              className="
                resize-none
                scrollbar-hide
                text-[1.10rem]
                pl-4
                py-3
                outline-none
                w-full
                bg-transparent
                max-h-32
              "
              placeholder="Type a message"
              name="input"
              id="input"
            />

            <button
              type="submit"
              className="cursor-pointer active:bg-black/20 transition duration-120 rounded-full p-2 flex items-center justify-center"
            >
              <img
                className="w-6"
                src="/assets/icons/send.png"
                alt="send"
              />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Conversation;
