import MessageChip from "./MessageChip";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { useCallback, useState, useRef } from "react";
import { sendRequest } from "../../services/requestServices";
import { sendNotification } from "../../services/notificationServices";

// TODO: useKeyValue
const instantMessages = ["Nahi", "Haaaan", "kyun", "Chup Raho", "kyun re haramzade"];

const Chatsnippet = ({
    userData = null,
    recipientID = null,
    recipientAvatar = null,
    recipientName = null,
    conversationId = null,
    conversationData = null,
    setError,
}) => {
    const navigate = useNavigate();
    const [requestBtnState, setRequestBtnState] = useState(false);
    const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

    const regex =
        /(\/emojis library\/([^/]+)\/([A-Za-z0-9-]+)_u([a-f0-9_]+)\.json)&([\p{Emoji}\u200d\ufe0f]+)/giu;

    // Navigate to conversation page
    const roomHandler = useCallback(() => {
        if (!conversationId) return;
        navigate(`/home/convo/${conversationId}`);
    }, [conversationId]);

    // Create chat request and send notification
    const requestHandler = useCallback(async () => {
        sendRequest(userData?._id, recipientID)
            .then((res) => {
                const requestId = res?.result._id;
                setRequestBtnState(true);
                sendNotification(recipientID, "request", requestId).then(() =>
                    setRequestBtnState(false)
                );
            })
            .catch((error) => setError(error));
    }, [userData, recipientID, setError]);

    // Extract last grapheme (emoji or character)
    const extractLastEmoji = useCallback((text) => {
        const graphemes = [
            ...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text),
        ];
        return graphemes.at(-1)?.segment ?? "";
    }, []);

    return (
        <div
            className={`
                w-full p-2 rounded-2xl flex flex-col justify-between
                backdrop-blur-[1.5px] bg-[rgba(255,255,255,0.3)] 
                border border-[rgba(255,255,255,0.1)] ease-in-out
                transition-all duration-400 hover:scale-103
                ${isChatDrawerOpen ? "max-h-50" : "min-h-0"}
            `}
        >   
            {/* Chat metadata */}
            <div 
                onClick={roomHandler}
                className="self-start flex items-center justify-between w-full">
                {/* Left section: Avatar + Content */}
                <div className="flex items-center gap-3 w-[85%]">
                    {/* Avatar */}
                    <div className="w-12 cursor-pointer">
                        {recipientAvatar ? (
                            <img className="rounded-full" src={recipientAvatar} alt="avatar" />
                        ) : (
                            <img
                                src={`/avatars/${recipientName[0].toUpperCase()}.png`}
                                alt="avatar"
                            />
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col flex-1 items-start min-w-0">
                        <p className="font-semibold">{recipientName}</p>
                        {conversationData?.lastMessage ? (
                            <>
                                {regex.test(conversationData.lastMessage)
                                    ? extractLastEmoji(conversationData.lastMessage)
                                    : conversationData.lastMessage}
                            </>
                        ) : (
                            <i>No messages to show</i>
                        )}
                    </div>
                </div>

                {/* Right section: Actions + Meta */}
                <div className="flex flex-col min-w-[20%] items-end gap-y-1">
                    {!conversationId && (
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
                    )}

                    {conversationData && (
                        <span className="text-xs">{conversationData.lastMessageTime}</span>
                    )}

                    <div className="flex flex-row-reverse items-center gap-x-1">
                        {conversationData?.unreadCount &&
                            <span
                                className="
                                    backdrop-blur-lg backdrop-saturate-180 
                                    bg-[rgba(33,50,28,0.75)] border border-[rgba(255,255,255,0.125)] 
                                    shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-full w-5 h-5 flex items-center 
                                    justify-center text-white text-[0.6rem]
                                "
                            >
                                {conversationData?.unreadCount}
                            </span>
                        }
                        <div 
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsChatDrawerOpen(prev => !prev)
                            }}
                            className="rounded-full hover:bg-black/30 active:bg-black/30 px-1.25">
                            {isChatDrawerOpen ? (
                                <i className="fa-solid fa-angle-up" />
                            ) : (
                                <i className="fa-solid fa-angle-down" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Instant Messages */}
            <div
                className={`
                    grid transition-all duration-300
                    ${isChatDrawerOpen ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"}
                `}
            >
                <div className="overflow-hidden">
                    <div className="flex flex-col items-start gap-y-2 select-none">
                        {/* Instant Message heading + custom messages*/}
                        <div className="flex items-center justify-between w-full">
                            <p className="text-xs text-black/60">Instant Message</p>
                            <i className="fa-solid fa-plus rounded-full active:bg-black/20 px-1.25 py-1"></i>
                        </div>

                        {/* Messages */}
                        <div className="flex flex-wrap gap-2 self-center">
                            {instantMessages.map((message, i) => (
                                <MessageChip
                                    key={i}
                                    senderName={userData?.username}
                                    message={message}
                                    conversationId={conversationId}
                                    setIsChatDrawerOpen={setIsChatDrawerOpen}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Chatsnippet;