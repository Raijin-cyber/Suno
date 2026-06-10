import { useState } from "react";

const Chat = ({ msgId, msg, referenceMsg, creator, referenceMsgCreator, isOwn, time, referenceMsgIdSetter, referenceMsgSetter, referenceMsgCreatorSetter, convoType, readReceipt }) => {

  const [showChatControls, setShowChatControls] = useState(false);

  const baseClasses =
    "relative flex flex-col justify-between max-w-[90%] lg:max-w-2xl min-w-[5.25rem] px-3 py-2";

  const ownClasses =
    "animate-fade-in-left animate-duration-[100ms] rounded-l-2xl rounded-br-2xl bg-[#fc94af] shadow-[inset_3px_3px_3px_#b56b7e,inset_-3px_-3px_3px_#ffbde0]";

  const otherClasses =
    "animate-fade-in-right animate-duration-[100ms] rounded-bl-2xl rounded-r-2xl bg-[#fc94af] shadow-[3px_3px_2px_#b56b7e,-2px_-2px_2px_#ffbde0]";

  const referenceMsgSetterHandler = (e) => {
    const chatBubble = document.getElementById(`chat_bubble${msgId}`);
    referenceMsgIdSetter(msgId);

    // right now we have to pass two parametric functions but we only need Ids
    referenceMsgSetter(chatBubble.innerText);
    referenceMsgCreatorSetter(creator);
  }

  return (
    <div onMouseEnter={() => setShowChatControls(true)} onMouseLeave={() => setShowChatControls(false)} className={` flex ${isOwn ? "justify-start flex-row-reverse" : "justify-start"} mb-2 gap-x-8 items-center`}>
      {/* Chat */}
      <div className={`${baseClasses} ${isOwn ? ownClasses : otherClasses} break-all overflow-hidden`}>
        {/* Sender name */}
        {(creator && convoType === "group") && (
          <p className="text-xs font-semibold text-gray-600 mb-1 items-start">{creator}</p>
        )}

        {/* reference message */}
        {referenceMsg && 
          <div className={`${isOwn ? "rounded-tl-xl" : "rounded-tr-xl"} flex flex-col justify-start backdrop-blur-[18px] backdrop-saturate-67 bg-black/5 border border-black/5 px-1 mt-1 py-0.5 text-[0.9rem] text-black/60`}>
            <p className="font-medium">{`>${referenceMsgCreator === creator && isOwn ? "YOU" : referenceMsgCreator}`}</p>
            <p className="">{referenceMsg}</p>
          </div>
        }

        {/* Message */}
        <p id={`chat_bubble${msgId}`} className={`text-[1.10rem] text-gray-800 ${isOwn ? "self-end" : "self-start"}`}>{msg}</p>

        {/* Read Receipt */}
        {isOwn && <span className="absolute bottom-2.5 left-3"><img className="w-3" src={`/assets/icons/${readReceipt ? "blueTick" : "greenTick"}.png`} alt="tick" /></span>}

        {/* Timestamp */}
        <span className={`text-xs tracking-tight font-light ${isOwn ? "self-end" : "self-start"}`}>{time}</span>
      </div>
      
      {/* Chat controls */}
      {showChatControls &&
        <div className={`flex items-center gap-x-2 ${!isOwn && "flex-row-reverse"}`}>
          <button onClick={referenceMsgSetterHandler} className="hover:bg-black/20 rounded-full p-1 transition duration-200 active:bg-black/30"><img className="max-w-5 min-w-5" src="/assets/icons/reply.png" alt="reply" /></button>
          <button className="hover:bg-black/20 rounded-full p-1 transition duration-200 active:bg-black/30"><img className="max-w-5 min-w-5" src="/assets/icons/add_emoji.png" alt="reaction" /></button>
          <button className="hover:bg-black/20 rounded-full p-1 transition duration-200 active:bg-black/30"><img className="max-w-5 min-w-5" src="/assets/icons/dots_black.png" alt="controls" /></button>
        </div>
      }
    </div>
  );
};

export default Chat;
