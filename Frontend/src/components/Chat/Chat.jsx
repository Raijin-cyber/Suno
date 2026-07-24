import { useState, memo, useCallback, useMemo, useRef } from "react";
import ChatContextMenu from "./ChatContextMenu";
import Emoji from "../EmojiPicker/Emoji";

const emojiRegex =
  /(\/emojis-library\/([^/]+)\/([A-Za-z0-9-]+)_u([a-f0-9_]+)\.json)&([\p{Emoji}\u200d\ufe0f]+)/iu;

const Chat = ({
  messageId,
  message,
  creator,
  readReceipt=false,
  referenceMessage,
  setReferenceMessage,
  referenceMessageCreator,
  convoType,
  isOwn,
  time,
}) => {
  const chatContextRef = useRef(null);
  const [showChatControls, setShowChatControls] = useState(false);
  const [chatContextState, setChatContextState] = useState(false);

  // Parse current message
  const parsedMessage = useMemo(() => {
    if (!message || !emojiRegex.test(message)) {
      return {
        isEmoji: false,
        text: message,
        emoji: null,
        file: null,
      };
    }

    const [file, emoji] = message.split("&");

    return {
      isEmoji: true,
      text: message,
      emoji,
      file,
    };
  }, [message]);

  // Parse replied message
  const parsedReferenceMessage = useMemo(() => {
    if (!referenceMessage || !emojiRegex.test(referenceMessage)) {
      return {
        isEmoji: false,
        text: referenceMessage,
        emoji: null,
        file: null,
      };
    }

    const [file, emoji] = referenceMessage.split("&");

    return {
      isEmoji: true,
      text: referenceMessage,
      emoji,
      file,
    };
  }, [referenceMessage]);

  const referenceMessageSetterHandler = useCallback(() => {
    setReferenceMessage({
      id: messageId,
      message: parsedMessage.isEmoji ? parsedMessage.emoji : message,
      creator,
    });
  }, [
    creator,
    message,
    messageId,
    parsedMessage,
    setReferenceMessage,
  ]);

  const chatContextMenuHandler = useCallback(() => {
    setChatContextState(prev => !prev);
  }, []);

  const baseClasses =
    "relative flex flex-col justify-between max-w-[90%] lg:max-w-2xl min-w-[5.25rem] px-3 py-2";

  const ownClasses =
    "animate-fade-in-left animate-duration-[100ms] rounded-l-2xl rounded-br-2xl bg-[#fc94af] shadow-[inset_3px_3px_3px_#b56b7e,inset_-3px_-3px_3px_#ffbde0]";

  const otherClasses =
    "animate-fade-in-right animate-duration-[100ms] rounded-bl-2xl rounded-r-2xl bg-[#fc94af] shadow-[3px_3px_2px_#b56b7e,-2px_-2px_2px_#ffbde0]";

  return (
    <div
      className={`flex ${
        isOwn ? "justify-start flex-row-reverse" : "justify-start"
      } mb-2 gap-x-8 items-center`}
      onMouseEnter={() => setShowChatControls(true)}
      onMouseLeave={() => setShowChatControls(false)}
    >
      {/* Chat Bubble */}
      <div
        className={`${baseClasses} ${
          isOwn ? ownClasses : otherClasses
        } break-all overflow-hidden`}
      >
        {/* Sender */}
        {creator && convoType === "group" && (
          <p className="text-xs font-semibold text-gray-600 mb-1">
            {creator}
          </p>
        )}

        {/* Reply */}
        {referenceMessage && (
          <div
            className={`${
              isOwn ? "rounded-tl-xl" : "rounded-tr-xl"
            } flex flex-col justify-start backdrop-blur-[18px] backdrop-saturate-67 bg-black/5 border border-black/5 px-1 mt-1 py-0.5 text-[0.9rem] text-black/60`}
          >
            <p className="font-medium">
              {`>${
                referenceMessageCreator === creator && isOwn
                  ? "YOU"
                  : referenceMessageCreator
              }`}
            </p>

            {parsedReferenceMessage.isEmoji ? (
              parsedReferenceMessage.emoji
            ) : (
              <p>{parsedReferenceMessage.text}</p>
            )}
          </div>
        )}

        {/* Message */}
        <span
          id={`chat_bubble${messageId}`}
          className={`text-[1.10rem] text-gray-800 ${
            isOwn ? "self-end" : "self-start"
          }`}
        >
          {parsedMessage.isEmoji ? (
            <Emoji
              file={parsedMessage.file}
              emoji={parsedMessage.emoji}
              animateState
            />
          ) : (
            parsedMessage.text
          )}
        </span>

        {/* Read Receipt */}
        {isOwn && (
          <span className="absolute bottom-2.5 left-3">
            <img
              className="w-3"
              src={`/assets/icons/${
                readReceipt ? "blueTick" : "greenTick"
              }.png`}
              alt="tick"
            />
          </span>
        )}

        {/* Time */}
        <span
          className={`text-xs tracking-tight font-light ${
            isOwn ? "self-end" : "self-start"
          }`}
        >
          {time}
        </span>
      </div>

      {/* Controls */}
      {showChatControls && (
        <div
          className={`relative flex items-center gap-x-2 ${
            !isOwn && "flex-row-reverse"
          }`}
        >
          {/* reply */}
          <button
            onClick={referenceMessageSetterHandler}
            className="hover:bg-black/20 rounded-full p-1 transition duration-200 active:bg-black/30"
          >
            <img
              className="max-w-5 min-w-5"
              src="/assets/icons/reply.png"
              alt="reply"
            />
          </button>

          {/* react */}
          <button className="hover:bg-black/20 rounded-full p-1 transition duration-200 active:bg-black/30">
            <img
              className="max-w-5 min-w-5"
              src="/assets/icons/add_emoji.png"
              alt="reaction"
            />
          </button>

          {/* chatContext */}
          <button 
            onClick={chatContextMenuHandler}
            className="hover:bg-black/20 rounded-full p-1 transition duration-200 active:bg-black/30">
            <img
              ref={chatContextRef}
              className="max-w-5 min-w-5"
              src="/assets/icons/dots_black.png"
              alt="context"
            />
          </button>
          <ChatContextMenu
            chatContextRef={chatContextRef}
            chatContextState={chatContextState} 
            setChatContextState={setChatContextState} 
          />

        </div>
      )}
    </div>
  );
};

export default memo(Chat);