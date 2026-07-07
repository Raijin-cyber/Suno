import { useState, useRef, memo, useCallback, useEffect } from "react";
import Emoji from "./EmojiPicker/Emoji";

const Chat = ({ 
  messageId, 
  message, 
  creator, 
  readReceipt,
  referenceMessage, 
  setReferenceMessage,
  referenceMessageCreator, 
  convoType, 
  isOwn, 
  time, 
}) => {
  const chatBubble = useRef(null); 
  
  // REGEX EXPRESSION FOR COMPARING WHETHER A MESSAGE IS TEXT OR AN EMOJI
  const regex = /(\/emojis library\/([^/]+)\/([A-Za-z0-9-]+)_u([a-f0-9_]+)\.json)&([\p{Emoji}\u200d\ufe0f]+)/giu;
  const [showChatControls, setShowChatControls] = useState(false);

  const [emojiMessage, setEmojiMessage] = useState(null);
  const [emojiFilePath, setEmojiFilePath] = useState(null);
  const [emojiReferenceMessage, setEmojiReferenceMessage] = useState(null);

  useEffect(() => {
    if(regex.test(message)) {
      const [file, emoji] = message.split('&');
      setEmojiMessage(emoji);
      setEmojiFilePath(file);
    }

    if(regex.test(referenceMessage)) {
      const [file, emoji] = referenceMessage.split('&');
      setEmojiReferenceMessage(emoji);
    }
  }, [message, referenceMessage])

  // Tailwind utility classes
  const baseClasses =
    "relative flex flex-col justify-between max-w-[90%] lg:max-w-2xl min-w-[5.25rem] px-3 py-2";
  const ownClasses =
    "animate-fade-in-left animate-duration-[100ms] rounded-l-2xl rounded-br-2xl bg-[#fc94af] shadow-[inset_3px_3px_3px_#b56b7e,inset_-3px_-3px_3px_#ffbde0]";
  const otherClasses =
    "animate-fade-in-right animate-duration-[100ms] rounded-bl-2xl rounded-r-2xl bg-[#fc94af] shadow-[3px_3px_2px_#b56b7e,-2px_-2px_2px_#ffbde0]";

  const referenceMessageSetterHandler = useCallback(() => {
    setReferenceMessage(
      {
        id: messageId,
        message: emojiMessage || message,
        creator: creator
      }
    )
  }, [emojiFilePath, emojiMessage, message])
  return (
    <div onMouseEnter={() => setShowChatControls(true)} onMouseLeave={() => setShowChatControls(false)} className={` flex ${isOwn ? "justify-start flex-row-reverse" : "justify-start"} mb-2 gap-x-8 items-center`}>
      {/* Chat */}
      <div className={`${baseClasses} ${isOwn ? ownClasses : otherClasses} break-all overflow-hidden`}>
        {/* Sender name */}
        {(creator && convoType === "group") && (
          <p className="text-xs font-semibold text-gray-600 mb-1 items-start">{creator}</p>
        )}

        {/* reference message */}
        {referenceMessage && 
          <div className={`${isOwn ? "rounded-tl-xl" : "rounded-tr-xl"} flex flex-col justify-start backdrop-blur-[18px] backdrop-saturate-67 bg-black/5 border border-black/5 px-1 mt-1 py-0.5 text-[0.9rem] text-black/60`}>
            <p className="font-medium">{`>${referenceMessageCreator === creator && isOwn ? "YOU" : referenceMessageCreator}`}</p>
            <p className="">{emojiReferenceMessage || referenceMessage}</p>
          </div>
        }

        {/* Message */}
        <span id={`chat_bubble${messageId}`} ref={chatBubble} className={`text-[1.10rem] text-gray-800 ${isOwn ? "self-end" : "self-start"}`}>
          {emojiFilePath ?
            <Emoji file={emojiFilePath} emoji={emojiMessage} animateState={true} />
            : message
          }
        </span>

        {/* Read Receipt */}
        {isOwn && <span className="absolute bottom-2.5 left-3"><img className="w-3" src={`/assets/icons/${readReceipt ? "blueTick" : "greenTick"}.png`} alt="tick" /></span>}

        {/* Timestamp */}
        <span className={`text-xs tracking-tight font-light ${isOwn ? "self-end" : "self-start"}`}>{time}</span>
      </div>
      
      {/* Chat controls */}
      {showChatControls &&
        <div className={`flex items-center gap-x-2 ${!isOwn && "flex-row-reverse"}`}>
          <button onClick={referenceMessageSetterHandler} className="hover:bg-black/20 rounded-full p-1 transition duration-200 active:bg-black/30"><img className="max-w-5 min-w-5" src="/assets/icons/reply.png" alt="reply" /></button>
          <button className="hover:bg-black/20 rounded-full p-1 transition duration-200 active:bg-black/30"><img className="max-w-5 min-w-5" src="/assets/icons/add_emoji.png" alt="reaction" /></button>
          <button className="hover:bg-black/20 rounded-full p-1 transition duration-200 active:bg-black/30"><img className="max-w-5 min-w-5" src="/assets/icons/dots_black.png" alt="controls" /></button>
        </div>
      }
    </div>
  );
};

export default memo(Chat);
