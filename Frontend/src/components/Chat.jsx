const Chat = ({ msg, creator, isOwn, time }) => {
  const baseClasses =
    "flex flex-col justify-between max-w-[90%] lg:max-w-2xl min-w-[5.25rem] px-3 py-2";

  const ownClasses =
    "animate-fade-in-left animate-duration-[100ms] rounded-l-2xl rounded-br-2xl bg-[#fc94af] shadow-[inset_3px_3px_3px_#b56b7e,inset_-3px_-3px_3px_#ffbde0]";

  const otherClasses =
    "animate-fade-in-right animate-duration-[100ms] rounded-bl-2xl rounded-r-2xl bg-[#fc94af] shadow-[3px_3px_2px_#b56b7e,-2px_-2px_2px_#ffbde0]";

  return (
    <div className={` flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`${baseClasses} ${isOwn ? ownClasses : otherClasses} break-all overflow-hidden`}>
        {/* Sender name */}
        {creator && (
          <p className="text-xs font-semibold text-gray-600 mb-1 items-start">{creator}</p>
        )}

        {/* Message */}
        <p className={`text-[1.10rem] text-gray-800 ${isOwn ? "self-end" : "self-start"}`}>{msg}</p>

        {/* Timestamp */}
        <span className={`text-xs tracking-tight font-light ${isOwn ? "self-end" : "self-start"}`}>{time}</span>
      </div>
    </div>
  );
};

export default Chat;
