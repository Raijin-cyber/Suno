import { socket } from "../socket/socket";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { listenForMessages } from "../socket/chat";
import { listenForMarkAsReadEvent } from "../socket/conversation";
import { listenForTypingEvent, listenForNotTypingEvent } from "../socket/typing";
import { listenForOnlineUsersEvent, listenForOfflineUsersEvent } from "../socket/presence";

const useMountListeners = () => {
    const dispatch = useDispatch();

    const mountListeners = useCallback(() => {
        const messagesListener = listenForMessages(socket, dispatch);
        const markAsReadEventListener = listenForMarkAsReadEvent(socket, dispatch);
        const typingUsersEventListener = listenForTypingEvent(socket, dispatch);
        const notTypingUsersEventListener = listenForNotTypingEvent(socket, dispatch);
        const onlineUserEventListener = listenForOnlineUsersEvent(socket, dispatch);
        const offlineUserEventListner = listenForOfflineUsersEvent(socket, dispatch);

        return {
            messagesListener, 
            markAsReadEventListener, 
            typingUsersEventListener,
            notTypingUsersEventListener,
            onlineUserEventListener,
            offlineUserEventListner 
        }
    }, [])
    
    useEffect(() => {   
        const { 
            messagesListener, 
            markAsReadEventListener, 
            typingUsersEventListener,
            notTypingUsersEventListener,
            onlineUserEventListener,
            offlineUserEventListner 
        } = mountListeners();

        return () => {
            messagesListener() 
            markAsReadEventListener() 
            typingUsersEventListener()
            notTypingUsersEventListener()
            onlineUserEventListener()
            offlineUserEventListner()
        }
    }, []);
}

export default useMountListeners;