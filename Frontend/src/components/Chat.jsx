const Chat = ({ msg, creator = "admin", isOwn, time }) => {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`flex flex-col justify-between max-w-xs min-w-17 p-2 rounded-md shadow-md ${
          isOwn ? "bg-[#ffbae4] items-end" : "bg-[#fe9c83] items-start"
        }`}
      >
        {/* Sender name */}
        <p className="text-xs font-semibold text-gray-600 mb-1">
          {creator}
        </p>

        {/* Message */}
        <p className="text-sm text-gray-800">{msg}</p>
      
        {/* message sent time */}
        <span className="text-xs font-light text-left">{time}</span>
      </div>
    </div>
  );
};

export default Chat;
