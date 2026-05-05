const Chatsnippet = ({recipientAvatar, recipientName, lastMessage, lastMessageTime, UnreadMessageCount}) => {
    return(
        <div className="flex items-center justify-between w-full hover:bg-black/20 active:bg-black/20 p-2 rounded-2xl transition duration-100">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-auto">
                    <img src="/assets/icons/user.png" />    
                </div>    

                {/* Main Content */}
                <div className="flex flex-col">
                    <p className="font-semibold">{recipientName}</p>
                    <p className="text-[0.85rem]">{lastMessage ? lastMessage : "Hello Ujjii"}</p>
                </div>
            </div>

            {/* Time and unread messages */}
            <div className="flex flex-col items-end justify-center">
                <span className="text-xs">11:11 AM</span>   
                <span className="bg-[#ec6340] rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">1</span>
            </div>

        </div>
    )
}

export default Chatsnippet;