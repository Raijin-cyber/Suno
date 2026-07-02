import MessageList from "../components/MessageList";
import { useDispatch, useSelector } from "react-redux";
import useExecuteInView from "../hooks/useExecuteInView";
import useMarkAsReadMSG from "../hooks/useMarkAsReadMSG";
import MessageComposer from "../components/MessageComposer";
import TypingIndicator from "../components/TypingIndicator";
import { emitMarkAsReadEvent } from "../socket/conversation";
import MirageCustom from "../components/Loaders/MirageCustom";
import useFetchMessageBatch from "../hooks/useFetchMessageBatch";
import ConversationHeader from "../components/ConversationHeader";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const Conversation = () => {
    const navigate = useNavigate();
    const previousHeight = useRef(0);
    const topTriggerRef = useRef(null);
    const { id: roomId } = useParams();
    const initialLoaded = useRef(false);
    const conversationPane = useRef(null);
    const [closing, setClosing] = useState(false);
    const conversationContext = useOutletContext();
    const [scrlBtnState, setScrlBtnState] = useState(false);
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

    const {
      trigger: inView,
      setTrigger: setInView
    } =
    useExecuteInView({ target: topTriggerRef.current });

    const {
      error: errorOnFetch,
      loading: loadingFetch,
      hasMore
    } = 
      useFetchMessageBatch({ 
        conversationId: roomId,
        userData,
        trigger: inView 
    });

    const { error: markAsReadErrors } = 
      useMarkAsReadMSG({ 
        conversationId: roomId, 
        conversations: conversationMessages
    });

    useEffect(() => {
      previousHeight.current = 0;
      initialLoaded.current = false;
      setInView(true);
    }, [roomId])

    useEffect(() => {
      const callback = () => {
        const pane = conversationPane.current;
        if (!pane) return;

        const scrollTop = pane.scrollTop;
        const scrollHeight = pane.scrollHeight;
        const clientHeight = pane.clientHeight;

        // distance from bottom
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceFromBottom > 1000 && !scrlBtnState) {
          setScrlBtnState(true);
        } else if (distanceFromBottom <= 1000 && scrlBtnState) {
          setScrlBtnState(false);
        }
      };

      const el = conversationPane.current;
      el.addEventListener("scroll", callback);
      return () => el.removeEventListener("scroll", callback);
    }, [roomId, scrlBtnState]);

    useEffect(() => {
      const pane = conversationPane.current;
      if (!pane) return;

      // Initial load → jump bottom
      if (!loadingFetch && !initialLoaded.current && conversationMessages.length) {
        requestAnimationFrame(() => {
          pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
          initialLoaded.current = true;
          previousHeight.current = pane.scrollHeight;
        });
        return;
      }

      // Pagination → preserve position
      if (loadingFetch && inView) {
        if (!previousHeight.current) {
          previousHeight.current = pane.scrollHeight;
        }
        return;
      }

      if (!loadingFetch && inView) {
        requestAnimationFrame(() => {
          const diff = pane.scrollHeight - previousHeight.current + 100;
          pane.scrollTo({
            top: pane.scrollTop + diff,
            behavior: "instant",
          });
          previousHeight.current = pane.scrollHeight;
        });
        return;
      }

      // Normal incoming messages
      const nearBottom =
        pane.scrollHeight - pane.scrollTop - pane.clientHeight < 1500;

      if (nearBottom) {
        requestAnimationFrame(() => {
          pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
        });
      }
    }, [conversationMessages.length, loadingFetch, roomId]);

    const handleCloseConversation = useCallback(() => {
      setClosing(true);
      setTimeout(() => navigate("/home"), 200);
    }, [])

    const handleScrollToBottom = useCallback(() => {
      conversationPane.current
      .scrollTo({ top: conversationPane.current.scrollHeight, behavior: "smooth"})
    }, [])
  return (
    <>
      {/* Conversation */}
      <div ref={conversationPane} className={`${!closing ? "animate-slide-in-top" : "animate-fade-out-right animate-duration-200"} overflow-y-scroll scrollbar-hide animate-duration-100 relative flex flex-col h-full w-full p-5`}>
      
        {/* ####### Header ####### */}
        <div className="z-10 sticky top-0 flex items-center justify-between rounded-2xl py-2 px-4 backdrop-blur-[1.5px] bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]">
            <ConversationHeader 
              conversationContext={conversationContext}
              participant={participant}
              otherMemberStatus={otherMemberStatus}
              handleCloseConversation={handleCloseConversation}
            />
        </div>

        {/* Top Trigger Ref */}
        <div ref={topTriggerRef} className="h-px"/>

        {/* First Message */}
        <div className="relative flex flex-col justify-center items-center">
          <img className="sm:w-90 md:w-100 lg:w-140" src="/assets/illustrations/Political debate-rafiki.png" alt="first-message" />
          <p className="absolute -bottom-5 md:bottom-2 text-center font-light text-xl">Got something to say? Type it below!</p>
        </div>

        {/* ####### Chats ####### */}
        <div id="chat-area" className="relative w-full mt-12 flex-1 px-2">
          {/* Actual conversations */}
          <div className={`flex flex-col gap-y-2 transition-all duration-300 ${typingMembers?.length > 0 ? "-translate-y-10" : "translate-y-0"}`}>
            {
              !hasMore && <p className="text-center text-xs font-light tracking-wider">No more messages</p> 
            }
            {
              loadingFetch ? 
              <MirageCustom /> :
              <MessageList 
                conversationMessages={conversationMessages}
                referenceMessage={referenceMessage}
                setReferenceMessage={setReferenceMessage}
                conversationContext={conversationContext}
                participant={participant}
              />
            }
          </div>
          {/* Typing Indicator when other members are typing */}
          <TypingIndicator isTyping={typingMembers?.length > 0} />
        </div>

        {/* ####### Message sending Area ####### */}
        <div className="sticky bottom-0 w-full flex items-center justify-between gap-2 py-2">
          <MessageComposer 
            conversationPane={conversationPane.current}
            conversationId={roomId} 
            referenceMessage={referenceMessage}
            setReferenceMessage={setReferenceMessage}
          />
        </div>
      </div>

      {scrlBtnState &&
        // Scroll to bottom
        <div
          onClick={handleScrollToBottom} 
          className="fixed bottom-35 right-9 z-50
                        w-12 h-12 flex items-center justify-center
                        bg-white/60 shadow-lg rounded-full
                        cursor-pointer hover:scale-105 active:scale-95
                        transition-transform duration-200 backdrop-blur-sm">
          <img className="w-6 h-6" src="/assets/icons/down-arrow.svg" alt="down" />
        </div>
      }
    </>
  );
};

export default Conversation;
