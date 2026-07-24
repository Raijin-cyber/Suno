const ConversationHeader = ({
    conversationContext,
    participant,
    otherMemberStatus,
    handleCloseConversation
}) => {
    return (
        <>
            {/* Avatar and call, video call and ellipsis buttons */}
            <div className="flex items-center gap-x-3">
              <div onClick={handleCloseConversation} className="cursor-pointer rounded-full active:bg-black/20 transition duration-120 object-cover"><img src="/assets/icons/back.png" alt="back" /></div>
              <div className="cursor-pointer rounded-full object-cover h-10 w-10 md:h-15 md:w-15"><img className="rounded-full" src={participant?.avatar ? participant?.avatar : `/avatars/${participant?.username[0].toUpperCase()}.png`} alt="avatar" /></div>
              <div className="flex flex-col items-start">
                  <span className="text-[1.10rem] md:text-xl tracking-tight">{conversationContext?.convoType === "direct" ? participant?.username : "Group"}</span>
                  <span className="text-[0.8rem] md:text-xs font-light tracking-tight">{otherMemberStatus}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="cursor-pointer rounded-full active:bg-black/20 transition duration-120 p-2 object-cover"><img className="w-6 md:w-8" src="/assets/icons/video.png" alt="video" /></div>
              <div className="cursor-pointer rounded-full active:bg-black/20 transition duration-120 p-2 object-cover"><img className="w-6 md:w-8" src="/assets/icons/call.png" alt="call" /></div>
              <div className="cursor-pointer rounded-full active:bg-black/20 transition duration-120 p-2 object-cover"><img className="w-6 md:w-8" src="/assets/icons/dots_black.png" alt="dots" /></div>
            </div>
        </>
    )
}

export default ConversationHeader;