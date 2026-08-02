import {  useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useScreenWidth from "../hooks/useScreenWidth";

import Notification from "../components/Notification";
import Dashboard from "../components/Dashboard/Dashboard";
import Chatsnippet from "../components/ChatSnippet/Chatsnippet";
import NotificationPane from "../components/NotificationPane/NotificationPane";

import usePresence from "../hooks/usePresence";
import useJoinRooms from "../hooks/useJoinRooms";
import usePingServer from "../hooks/usePingServer";
import useConversations from "../hooks/useConversations";
import useNotifications from "../hooks/useNotifications";
import useMountListeners from "../hooks/useMountListeners";
import useListenForWSConnErrors from "../hooks/useListenForWSConnErrors";


const Home = () => {
    const navigate = useNavigate();
    const screenWidth = useScreenWidth();
    const { id, mode, userId } = useParams();
    const [addButtonState, setAddButtonState] = useState(false);
    
    // Fetching from the Redux Store
    const userData = useSelector(state => state.auth?.userData);
    const chatSnippetData = useSelector(state => state.conversations.byId) || {};
    
    // Notification state
    const [isNotifiOpen, setIsNotifiOpen] = useState(false);
    
    // Error variable for storing error state
    const [error, setError] = useState(null);

    // Debounce logic for querying
    const [query, setQuery] = useState(null);
    
    // states regarding conversation pane
    const isConversationOpen = !!id
    const showPlaceholder = !isConversationOpen && screenWidth >= 768;

    // mounting necessarry listeners
    useMountListeners();
    useListenForWSConnErrors(setError);

    // fetch all user's conversations
    const { 
        conversations, 
        error: conversationError, 
        loading: conversationLoading, 
        refresh: converastionRefresh 
    } = useConversations();

    // establish socket conn with convos
    useJoinRooms(conversations);

    // fetch all user's notifications
    const {
        notifications, 
        error: notificationError, 
        loading: notificationLoading, 
        refresh: notificationsRefresh
    } = useNotifications();

    // check for unread notification
    const isUnreadNotification = useMemo(() => notifications.includes(n => n.status === "unread"), [notifications]);

    // cache the conversations data
    const convoData = useMemo(() => {
        const convoDataHolder = new Map();
        conversations?.forEach(c => {
            convoDataHolder.set(c.convoId, c);
        })
        return convoDataHolder;
    }, [conversations]);

    // cache the room Ids
    const conversationIds = useMemo(() => {        
        return Array.from(convoData.keys());
    }, [convoData]);

    // emit presence satus
    usePresence({ 
        userId: userData?._id, 
        conversationIds 
    });

    // keep presence status alive
    const { ping } = usePingServer({ 
        userId: userData?._id, 
        conversationIds 
    })

    return (
        <div className="h-screen flex relative">
            {/* Conversations pane */}
            <div id="left pane" className="relative h-screen flex flex-col gap-y-5 px-4 py-3 w-full md:w-[46%] lg:w-[35%]">
                
                {/* Notification */}
                <Notification errorMessage={error} />

                {/* Dashboard */}
                <Dashboard userData={userData} setIsNotifiOpen={setIsNotifiOpen} setQuery={setQuery} setError={setError} isUnreadNotification={isUnreadNotification} />

                {/* Chat Snippet List */}
                <div className="h-full scrollbar-hide relative overflow-auto overflow-x-hidden rounded-xl p-4 bg-[#fc94af] shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4]">
                    {/* creating new conversation doorway */}
                    {mode && <Outlet context={{ convoType: mode, searchQuery: query, setError: setError }}/>}
        
                    {(!mode && userData) && (
                        <div className="flex flex-col gap-y-3 w-full">
                            {conversations?.map((convo) => {
                            
                            let recipientId;
                            let recipientName;
                            let recipientAvatar;
                            if (convo.convoType === "direct") {
                                const recipient = convo.members.find(
                                    (member) => member._id.toString() !== userData?._id
                                );
                                recipientId = recipient?._id;
                                recipientName = recipient?.username;
                                recipientAvatar = recipient?.avatar;
                            }

                            return (
                                <Chatsnippet
                                        key={convo.convoId}
                                        recipientID={recipientId}
                                        conversationId={convo.convoId}
                                        recipientName={recipientName}
                                        recipientAvatar={recipientAvatar}
                                        conversationData={chatSnippetData[convo.convoId]}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* New conversation floating button */}
                <div className={`absolute bottom-20 right-8`}>
                    {!mode &&
                        <div
                            className={`flex flex-col items-center justify-between gap-y-1 mb-1 transition-all duration-200 ${
                                addButtonState ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
                            }`}
                        >
                            <button onClick={() => navigate("/home/srchuser/direct")} className="active:scale-95 transition duration-150 cursor-pointer h-10 w-10 p-1.5 backdrop-blur-xs backdrop-saturate-180 bg-[rgba(17,25,40,0.75)] rounded-full border border-[rgba(255,255,255,0.125)] flex items-center justify-center">
                                <img src="/assets/icons/direct.png" alt="direct" />
                            </button>
                            <button onClick={() => navigate("/home/srchuser/group")} className="active:scale-95 transition duration-150 cursor-pointer h-10 w-10 p-1.5 backdrop-blur-xs backdrop-saturate-180 bg-[rgba(17,25,40,0.75)] rounded-full border border-[rgba(255,255,255,0.125)] flex items-center justify-center">
                                <img src="/assets/icons/group.png" alt="group" />
                            </button>
                        </div>
                    }

                    {!mode ?
                        <button
                            onClick={() => setAddButtonState(prev => !prev)}
                            className="cursor-pointer h-12 w-12 p-3 backdrop-blur-xs backdrop-saturate-180 bg-[rgba(17,25,40,0.75)] rounded-full border border-[rgba(255,255,255,0.125)] flex items-center justify-center"
                        >
                            <img src="/assets/icons/plus_white.png" alt="plus" />
                        </button>
                        :
                        <button
                            onClick={() => {
                                setAddButtonState(false);
                                navigate("/home")
                            }}
                            className="cursor-pointer h-12 w-12 p-3 backdrop-blur-xs backdrop-saturate-180 bg-[rgba(17,25,40,0.75)] rounded-full border border-[rgba(255,255,255,0.125)] flex items-center justify-center"
                        >
                            <img src="/assets/icons/cross.png" alt="plus" />
                        </button>
                    }
                </div>
                
                <div>
                    <div className="border-b-2 w-full mt-3"></div>
                    <p className="text-center font-light">All Chats are End-to-End Encrypted</p>
                </div>

                {/* notification pane */}
                <NotificationPane 
                    isNotifiOpen={isNotifiOpen}  
                    setIsNotifiOpen={setIsNotifiOpen}
                    notifications={notifications}
                    converastionRefresh={converastionRefresh}
                />

            </div>

            {/* message pane */}
            {(isConversationOpen || screenWidth >= 768) &&
                <div id="right pane" className="overflow-hidden scrollbar-hide absolute max-md:h-screen max-md:w-screen md:relative md:block md:w-[70%] md:shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4] md:m-3 rounded-3xl bg-[#fc94Af] z-20">
                
                    {/* Message when no conversation is opened */}
                    {
                        (!userId && !mode && showPlaceholder) &&
                        <div className="hidden md:flex flex-col items-center gap-y-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-[40%] px-5">
                            <img src="/assets/illustrations/Light bulb-cuate.png" alt="" />
                            <p className="text-center font-light mb-5">Tip: Select a conversation to see its chats here.</p>
                        </div>
                    }

                    {/* Message when creating a new conversation */}
                    {
                        mode &&
                        <div className="hidden md:flex flex-col items-center gap-y-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-[40%] px-5">
                            <img src="/assets/illustrations/Work time-pana.png" alt="" />
                            <p className="text-center font-light mb-5">Tip: Select a user to start a new conversation or create a group by selecting number of users.</p>
                        </div>
                    }

                    {/* Chats */}
                    {(id && !userId) &&
                        <div className="h-full w-full">
                            {/* this for the chat sub page with the existing conversations */}
                            <Outlet context={convoData.get(id)}/>
                        </div>
                    }

                    {/* Profile */}
                    {(id && userId) &&
                        <div className="h-full w-full">
                            {/* this for the profile sub page with the existing users */}
                            <Outlet context={convoData.get(id)?.members.find(u => u._id === userId)}/>
                        </div>
                    }
                
                </div>
            }
        </div>
    )
}

export default Home;
