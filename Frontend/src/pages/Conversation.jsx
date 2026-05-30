import Chat from "../components/Chat";
import { useDispatch } from "react-redux"; 
import { sendMessage, joinRoom, leaveRoom, listenForMessages } from "../socket/chat";
import { useSocket } from "../hooks/useSocket";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Conversation = () => {
    const socket = useSocket();
    const dispatch = useDispatch();
    const bottomRef = useRef();
    const conversationPane = useRef();
    const { id } = useParams();
    const navigate = useNavigate();
    const roomId = id.toString();
    const [chats, setChats] = useState([]);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
      joinRoom(socket, { conversationId: roomId });
      listenForMessages(socket, dispatch, setChats);
    }, [roomId]);

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);
    

    const sendMessageHandler = (e) => {
        e.preventDefault();
        if(e.target[0].value !== '') {
          sendMessage(socket, { conversationId: roomId, message: e.target[0].value });
          e.target[0].value = "";
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
    
  return (
    <div ref={conversationPane} className={`${!closing ? "animate-slide-in-top" : "animate-fade-out-right animate-duration-200"} animate-duration-100 relative flex flex-col h-full w-full`}>
      
      {/* ####### Header ####### */}
      <div className="z-1 sticky top-0 flex items-center justify-between rounded-2xl py-2 px-4 backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-x-3">
              <div onClick={handleCloseConversation} className="md:hidden cursor-pointer rounded-full active:bg-black/20 transition duration-120 object-cover"><img src="/assets/icons/back.png" alt="" /></div>
              <div className="cursor-pointer rounded-full object-cover h-10 w-10 md:h-15 md:w-15"><img src="/assets/icons/user.png" alt="Panda" /></div>
              <div className="flex flex-col items-start">
                  <span className="text-[1.10rem] md:text-xl tracking-tight">JOJO</span>
                  <span className="text-[0.8rem] md:text-xs font-light tracking-tight">Online</span>
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
      <div id="chat-area" className="w-full my-6 mt-12 px-5 flex-1">
        <div className="flex flex-col gap-y-2">
          {chats.map((chat, index) => (
            <Chat key={index} msg={chat.message} isOwn={chat.isOwn} time={chat.time} />
          ))}
        </div>
      </div>

      {/* Dummy DIV for bottom reference */}
      <div ref={bottomRef}></div>

      {/* ####### Sending Area ####### */}
      <div className="sticky bottom-0 w-full flex items-center justify-between space-x-4">
          <button className="cursor-pointer active:bg-black/20 transition duration-120 p-2 flex justify-center items-center rounded-full obejct cover backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]"><img className="w-6" src="/assets/icons/plus.png" alt="add" /></button>
          <div className="h-full pr-4 rounded-3xl flex grow items-center backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]">
              <form onSubmit={sendMessageHandler} className="flex items-center w-full">
                <textarea onKeyDown={submissionHandler} rows={1} className="text-[1.10rem] scrollbar-hide pl-4 py-4 outline-none w-full" type="text" placeholder="Type a message" name="input" id="input" />
                <button type="submit" className="cursor-pointer active:bg-black/20 transition duration-120 rounded-full p-2 flex items-center justify-center"><img className="w-6" src="/assets/icons/send.png" alt="send" /></button>
              </form>
          </div>
      </div>
    </div>
  );
};

export default Conversation;
