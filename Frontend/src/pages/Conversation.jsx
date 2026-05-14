import Chat from "../components/Chat";
import { sendMessage, receiveMessage, roomJoinEvent } from "../socket/chat";
import { useSocket } from "../hooks/useSocket";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Conversation = () => {
    const socket = useSocket();
    const { id } = useParams();
    const roomId = id.toString();
    const [chats, setChats] = useState([]);
    useEffect(() => {
        receiveMessage(socket, setChats);
        roomJoinEvent(socket, roomId);
    }, [])

    const sendMessageHandler = (e) => {
        e.preventDefault();
        if(e.target[0].value !== '') {
          sendMessage(socket, e.target[0].value, roomId);
          e.target[0].value = "";
        }
    }

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* ####### Header ####### */}
      <div className="h-[9.5%] w-full bg-[#fe8dd2] flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <img className="w-10 h-10 rounded-full" src="/assets/icons/user.png" alt="User Avatar" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">John Doe</span>
            <span className="text-xs text-green-700">Online</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <img className="w-5 h-5 cursor-pointer active:scale-90 transition duration-75" src="/assets/icons/call.png" />
          <img className="w-5 h-5 cursor-pointer active:scale-90 transition duration-75" src="/assets/icons/video.png" />
          <img className="w-5 h-5 cursor-pointer active:scale-90 transition duration-75" src="/assets/icons/dots.png" />
        </div>
      </div>

      {/* ####### Chats ####### */}
      <div className="flex-1 overflow-y-auto pb-22 bg-linear-to-tr from-[#eeeee0] via-[#fe8dd2] to-pink-300 bg-fixed p-4">
        <div className="relative z-10">
          {chats.map((chat, index) => (
            <Chat key={index} msg={chat.message} isOwn={chat.isOwn} time={chat.time} />
          ))}
        </div>
      </div>

      {/* ####### Sending Area ####### */}
      <div className="fixed bottom-0 z-50 flex items-center justify-between w-full bg-[#fe8dd2] p-2">
        <form onSubmit={sendMessageHandler}className="flex items-center justify-between bg-[#d9d9d9]/45 px-4 rounded-xl w-full">
            <textarea
                id="textarea"
                placeholder="Type a message"
                className="outline-none grow pt-5"
            />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <button className="w-6 h-6 active:scale-90 transition duration-75 cursor-pointer">
                  <img src="/assets/icons/emoji.png" />
                </button>
                <button className="w-6 h-6 active:scale-90 transition duration-75 cursor-pointer">
                  <img src="/assets/icons/camera.png" />
                </button>
              </div>
              <button type="submit" className="flex items-center justify-center bg-[#fd6842] p-3 rounded-full font-semibold hover:bg-pink-400 shadow-xl active:scale-90 transition duration-75">
                  <img className="w-5 h-5 cursor-pointer" src="/assets/icons/send.png" />
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
