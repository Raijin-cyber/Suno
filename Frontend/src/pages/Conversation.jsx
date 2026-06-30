import MessageList from "../components/MessageList";
import { useDispatch, useSelector } from "react-redux";
import useMarkAsReadMSG from "../hooks/useMarkAsReadMSG";
import MessageComposer from "../components/MessageComposer";
import TypingIndicator from "../components/TypingIndicator";
import { emitMarkAsReadEvent } from "../socket/conversation";
import ConversationHeader from "../components/ConversationHeader";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const Conversation = () => {
    const navigate = useNavigate();
    const bottomRef = useRef(null);
    const { id: roomId } = useParams();
    const conversationPane = useRef(null);
    const [closing, setClosing] = useState(false);
    const conversationContext = useOutletContext();
    const [referenceMessage, setReferenceMessage] = useState(null);
    
    const userData = useSelector(
      (state) => state.auth.userData
    ) || {};
    
    const onlineMembers = useSelector(
      (state) => state.conversations.presence[roomId]
    ) || [];

    const typingMembers = useSelector(
      (state) => state.conversations.byId[roomId]?.typingUsers
    );

    const conversationMessages = useSelector(
      (state) => state.messages.byConversationId[roomId]
    ) || [];

    const participant = useMemo(() => {
      return conversationContext?.members?.find(
        m => m._id !== userData._id
      );
    }, [conversationContext, userData]);

    const otherMemberStatus = useMemo(() => {
      return onlineMembers?.find(
        m => m.userId !== userData?._id
      )?.status || "offline";
    }, [onlineMembers, userData])

    // TODO: Fetch all messages and check whether messages already exist or not

    const { error: markAsReadErrors } = 
      useMarkAsReadMSG({ 
        conversationId: roomId, 
        conversations: conversationMessages
    });

    useEffect(() => {
      const pane = conversationPane.current;

      const nearBottom =
        pane.scrollHeight -
        pane.scrollTop -
        pane.clientHeight < 1500;

      if (nearBottom) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [conversationMessages.length]);
    
    const handleCloseConversation = useCallback(() => {
      setClosing(true);
      setTimeout(() => navigate("/home"), 200);
    }, [])
  return (
    <div ref={conversationPane} className={`${!closing ? "animate-slide-in-top" : "animate-fade-out-right animate-duration-200"} overflow-y-scroll scrollbar-hide animate-duration-100 relative flex flex-col h-full w-full p-5`}>
      
      {/* ####### Header ####### */}
      <div className="z-10 sticky top-0 flex items-center justify-between rounded-2xl py-2 px-4 backdrop-blur-[1.5px] bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]">
          <ConversationHeader 
            conversationContext={conversationContext}
            participant={participant}
            otherMemberStatus={otherMemberStatus}
          />
      </div>

      {/* First Message */}
      <div className="relative flex flex-col justify-center items-center">
        <img className="sm:w-90 md:w-100 lg:w-140" src="/assets/illustrations/Political debate-rafiki.png" alt="first-message" />
        <p className="absolute -bottom-5 md:bottom-2 text-center font-light text-xl">Got something to say? Type it below!</p>
      </div>

      {/* ####### Chats ####### */}
      <div id="chat-area" className="relative w-full mt-12 flex-1 px-2">
        {/* Actual conversations */}
        <div className={`flex flex-col gap-y-2 transition-all duration-300 ${typingMembers?.length > 0 ? "-translate-y-10" : "translate-y-0"}`}>
          <MessageList 
            conversationMessages={conversationMessages}
            referenceMessage={referenceMessage}
            setReferenceMessage={setReferenceMessage}
            conversationContext={conversationContext}
            participant={participant}
          />
        </div>
        {/* Typing Indicator when other members are typing */}
        <TypingIndicator isTyping={typingMembers?.length > 0} />
      </div>

      {/* Dummy DIV for bottom reference #### */}
      <div ref={bottomRef}></div>

      {/* ####### Message sending Area ####### */}
      <div className="sticky bottom-0 w-full flex items-center justify-between gap-2 py-2">
        <MessageComposer 
          conversationId={roomId} 
          referenceMessage={referenceMessage}
          setReferenceMessage={setReferenceMessage}
        />
      </div>
    </div>
  );
};

export default Conversation;
