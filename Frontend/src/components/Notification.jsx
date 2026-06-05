import { useEffect, useState } from "react";

const Notification = ({ errorMessage, conversationMessage }) => {
    
    if(!errorMessage && !conversationMessage) return null;
  
    const [closing, setClosing] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        setClosing(false);

        const timer = setTimeout(() => {
        setClosing(true); // trigger exit animation
        setTimeout(() => setVisible(false), 500); // wait for animation duration
        }, 3000);

        return () => clearTimeout(timer);
    }, [errorMessage, conversationMessage]);

    if (!visible) return null;

    return ( (errorMessage || conversationMessage) &&
        <div
            className={`absolute min-w-2xs xl:min-w-sm min-h-10 z-50 top-6 left-1/2 transform -translate-x-1/2 text-white backdrop-blur-xs backdrop-saturate-75 bg-black/50 rounded-xl border border-white/20 px-6 py-3 ${closing ? "animate-fade-out-up animate-duration-500" : "animate-fade-in-down animate-duration-500"}`}>
                {/* Error Message */}
            <p className="text-sm font-medium">
                {errorMessage && !errorMessage ? "Error: Something went wrong" : `${errorMessage.code}: ${errorMessage.message}`}
            </p>
                {/* Conversation Message */}
            <p className="text-sm font-medium">
                {conversationMessage && !conversationMessage ? "New message." : conversationMessage}
            </p>
        </div>
  );
};

export default Notification;
