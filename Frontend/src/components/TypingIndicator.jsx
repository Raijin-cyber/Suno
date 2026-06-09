const TypingIndicator = ({ isTyping }) => {
  return (
    <div
      className={`
        absolute left-0 bottom-0 flex w-fit items-center gap-x-1.5 py-3 px-2 
        backdrop-blur-lg backdrop-saturate-180 bg-[rgba(0,0,0,0.75)] 
        rounded-xl border border-[rgba(255,255,255,0.125)]
        transition-all duration-300 ease-in-out
        ${isTyping ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-0 -translate-x-4"}
      `}
    >
      <div className="w-2 h-2 bg-[#e5e5e5] rounded-full animate-bounce [animation-delay:0s]"></div>
      <div className="w-2 h-2 bg-[#e5e5e5] rounded-full animate-bounce [animation-delay:0.2s]"></div>
      <div className="w-2 h-2 bg-[#e5e5e5] rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
  );
};

export default TypingIndicator;
