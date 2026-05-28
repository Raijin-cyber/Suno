import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import { useScreenWidth } from "../hooks/useScreenWidth";
import { getCurrentUser, logoutUser, searchUser } from "../services/authServices";
import { receiveNotification, readNotification } from "../services/notificationServices"
import { getAllUserConversation } from "../services/conversationServices";
import { login, logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Chatsnippet from "../components/Chatsnippet";
import NotificationSnippet from "../components/NotificationSnippet";
import Silk from "../React-Bites Components/Silk";


const Home = () => {
    const [loading, setLoading] = useState(false);
    const { id, mode } = useParams();
    const userData = useSelector((state) => {return state.auth.userData});
    const socket = useSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const screenWidth = useScreenWidth();
    const [addButtonState, setAddButtonState] = useState(false);
    
    // Notification and alert logic
    const [ alert, setAlert ] = useState(true);
    const [isNotifiOpen, setIsNotifiOpen] = useState(false);
    const timerRef = useRef(null);
    const longPressTriggered = useRef(false);
    const handleMouseDown = () => {
        longPressTriggered.current = false;
        timerRef.current = setTimeout(() => {
            setAlert(prev => !prev);
            longPressTriggered.current = true;
        }, 1000);
    }
    const handleMouseUp = () => {
        clearTimeout(timerRef.current);
    }
    const handleClick = async() => {
        if(longPressTriggered.current) {
            // logic
            return;
        }
        setIsNotifiOpen(prev => true);
        await readNotification();
    }

    // This logic is for debounced search bar
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    // Users list, it is for creating a new conversation
    const [users, setUsers] = useState([]);
    
    // Conversation list, it is for opening the previuos conversation
    const [conversations, setConversations] = useState([]);

    // Notification list of a user
    const [notifications, setNotifications] = useState([]);

    const isConversationOpen = !!id
    const showPlaceholder = !isConversationOpen && screenWidth >= 768;

    //fetch all user's conversations
    useEffect(() => {
        (async() => {
            await getAllUserConversation()
            .then((convo) => {
                setConversations(convo);
            })
            .catch((err) => setConversations([]))
        })()
    }, [notifications])

    // fetch all user's notifications
    useEffect(() => {
        (async() => {
            receiveNotification()
            .then((res) => {
                console.log(res);
                setNotifications(res);
            }).
            catch((err) => setNotifications([]))
        })()
    }, [isNotifiOpen])

    // debounce logic for search bar
    useEffect(() => {
        if(mode === "direct" || mode === "group") {
            const handler = setTimeout(() => {
                setDebouncedQuery(query);
            }, 1000);
            return () => clearTimeout(handler);
        }
    }, [query]);

    // Now the function which you want execute
    useEffect(() => {
        if((mode === "direct" || mode === "group")) {
            setLoading(true);
            (async() => {                
                const users = await searchUser(debouncedQuery);
                setUsers(users);
                setLoading(false);
            })()
        }
    }, [debouncedQuery]);

    const logoutHandler = () => {
        logoutUser()
        .then(() => {
            dispatch(logout());       // clear Redux slice first
            socket.disconnect();      // then disconnect socket
            navigate("/");            // finally navigate
        })
        .catch((err) => {
            console.error("Logout failed:", err);
            // still clear state locally so UI resets
            dispatch(logout());
            socket.disconnect();
            navigate("/");
        });
    };


    const recipientName = ["JOJO", "JOJO", "JOJO", "JOJO", "JOJO", "JOJO", "JOJO", "JOJO", "JOJO", "JOJO", "JOJO", "JOJO", "JOJO", "JOJO"];

    return (
        <div className="h-screen flex relative">
            {/* Conversations pane */}
            <div id="left pane" className="relative h-screen flex flex-col gap-y-5 px-4 py-3 w-full md:w-[40%] lg:w-[30%]">
            
                <div className="min-w-full relative flex flex-col items-center mask-[radial-gradient(circle,white_95%,transparent_100%)] mask-no-repeat mask-center mask-cover rounded-3xl">
                    {/* React-Bite Component */}
                    <Silk
                        speed={2.9}
                        scale={1.2}
                        color="#de829a"
                        noiseIntensity={2}
                        rotation={1.21}
                    />

                    {/* This is DashBoard */}
                    <div className="px-2 absolute top-2 flex justify-between items-end w-full text-[#e5e5e5]">            
                        <div className="rounded-2xl p-2 flex flex-col items-start backdrop-blur-[5px] backdrop-saturate-125 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.125)]">
                            <span className="font-medium tracking-tight">Good evening,</span>
                            <span className="font-medium text-xl tracking-tight">{userData && userData.username}</span>
                        </div>
                        <div className="rounded-2xl p-2 flex items-center gap-x-2 backdrop-blur-[5px] backdrop-saturate-125 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.125)]">
                            <button className="w-8" onClick={logoutHandler}><img className="active:bg-white/20 rounded-full p-1 transition duration-75" src="/assets/icons/exit.png" /></button>
                            <div className="w-8"><img onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onClick={handleClick} className="active:bg-white/20 rounded-full p-1 transition duration-75" src={`/assets/icons/${alert ? "ring" : "silent"}.png`} /></div>
                            <div className="w-8"><img className="active:bg-white/20 rounded-full p-1 transition duration-75" src="/assets/icons/dots.png" /></div>
                        </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="absolute bottom-2 w-full px-2">
                        <input onChange={(e) => setQuery(e.target.value)} className="text-[#e5e5e5] backdrop-blur-[5px] backdrop-saturate-125 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.125)] p-4 rounded-3xl w-full px-4 py-2 text-md focus:outline-none" type="text" placeholder={`${mode ? "Search username" : "Search chat"}`} />
                    </div>
                </div>
                
                {/* Chat Snippet List */}
                <div className="h-full scrollbar-hide relative overflow-auto overflow-x-hidden rounded-xl p-4 bg-[#fc94af] shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4]">
                    {/* creating new conversation doorway */}
                    {mode && <Outlet context={{ mode: mode, users: users, loading: loading }}/>}
        
                    {(!mode && userData) && (
                        <div className="cursor-pointer flex flex-col gap-y-3 w-full">
                            {conversations.map((convo) => {
                            let recipientName;

                            if (convo.convoType === "direct") {
                                const recipient = convo.members.find(
                                (member) => member._id.toString() !== userData._id
                                );
                                recipientName = recipient?.username;
                            }

                            return (
                                <Chatsnippet
                                key={convo.convoId}
                                conversationId={convo.convoId}
                                recipientName={recipientName}
                                />
                            );
                            })}
                        </div>
                    )}
                </div>

                {/* New conversation floating button */}
                <div className="absolute bottom-20 right-8">
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
                <div id="notification pane" className={`${isNotifiOpen ? "translate-x-0" : "-translate-x-full"} absolute left-0 top-0 p-3 flex flex-col gap-y-5 ease-in-out max-md:bottom-0 overflow-hidden md:left-0 md:top-0 transition-all duration-500 bg-[#fc94Af] h-full w-full max-w-screen`}>
                    <div className="flex items-center justify-center">
                        <p className="font-sans text-center text-2xl font-medium w-full">Notification</p>
                        <button onClick={() => setIsNotifiOpen(prev => false)} className="absolute right-3 top-3 w-9"><img src="/assets/icons/cross_black.png" alt="cross" /></button>
                    </div>
                    
                    {/* notifications area */}
                    <div className="flex flex-col gap-y-2 h-full w-full py-5 px-4 rounded-3xl shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4]">
                        {notifications.map((notifi) => {
                                if(notifi.type === "request") return <NotificationSnippet key={notifi._id} notificationContent={notifi} requestNotification={true} />
                                if(notifi.type === "message") return <NotificationSnippet key={notifi._id} notificationContent={notifi}  messageNotification={true} />
                                if(notifi.type === "reminder") return <NotificationSnippet key={notifi._id} notificationContent={notifi} reminderNotification={true} />
                                if(notifi.type === "status") return <NotificationSnippet key={notifi._id} notificationContent={notifi} statusNotification={true} />
                                if(notifi.type === "receipt") return <NotificationSnippet key={notifi._id} notificationContent={notifi} receiptNotication={true} />
                                if(notifi.type === "system") return <NotificationSnippet key={notifi._id} notificationContent={notifi} systemNotification={true} />
                                if(notifi.type === "call") return <NotificationSnippet key={notifi._id} notificationContent={notifi} callNotifcation={true} />
                                if(notifi.type === "security") return <NotificationSnippet key={notifi._id} notificationContent={notifi} securityNotification={true} />
                                if(notifi.type === "general") return <NotificationSnippet key={notifi._id} notificationContent={notifi} generalNotification={true} />
                            })
                        }
                    </div>
                </div>
            </div>

            {/* message pane */}
            {(isConversationOpen || screenWidth >= 768) &&
                <div id="right pane" className="overflow-hidden scrollbar-hide absolute max-md:h-screen max-md:w-screen md:relative md:block md:w-[70%] md:shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4] md:m-3 rounded-3xl bg-[#fc94Af]">
                
                    {/* Message when no conversation is opened */}
                    {
                        (!mode && showPlaceholder) &&
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
                    <div className="h-full w-full p-5 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide">
                        {/* this for the chat sub page with the existing conversations */}
                        {id && <Outlet />}
                    </div>
                
                </div>
            }
        </div>
    )
}

export default Home;
