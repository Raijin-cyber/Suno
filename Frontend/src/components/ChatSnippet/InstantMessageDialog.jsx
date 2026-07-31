import { useCallback, useRef } from "react";
import MessageChip from "./MessageChip";

const InstantMessageDialog = ({ 
    instantDialogState=true, 
    clearKey,
    setInstantDialogState, 
    instantMessages,
    setInstantMessages // this is not a setState function from useState
}) => {
    const inputRef = useRef(null); 

    const removeIMHandler = useCallback((im, i) => {
        const newArrMessages = instantMessages?.filter((_im, _i) => _i !== i);
        console.log(instantMessages)
        setInstantMessages(newArrMessages);
    }, [instantMessages, setInstantMessages]);
    const addIMHandler = useCallback((e) => {
        e.preventDefault();
        const newMessage = inputRef.current.value.trim();
        if (!newMessage) return;

        let newArrMessages = [...(instantMessages || [])];
        if (newArrMessages.length === 5) newArrMessages.shift();
        newArrMessages.push(newMessage);

        setInstantMessages(newArrMessages);
        inputRef.current.value = '';
    }, [instantMessages, setInstantMessages]);


    return (
        instantDialogState &&
        <div className="fixed inset-0 h-screen w-screen bg-black/20 z-50 shadow-2xl">
            <div className="p-3 h-78 w-85 lg:w-90 rounded-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-[#fc94Af]">
                
                {/* close button */}
                <div 
                    onClick={() => setInstantDialogState(false)}
                    className="
                        absolute bg-black/30 rounded-full p-1 w-6 right-3 top-3
                        hover:scale-105 active:scale-95 transition-all duration-100
                    "
                >
                    <img src="/assets/icons/close_white.svg" alt="close" />
                </div>

                {/* form */}
                <div className="flex flex-col items-center justify-end gap-y-3 h-full w-full">
                    <p className="text-xl">Set custom Instant Messages</p>
                    
                    {/* current instant messages */}
                    <div className="flex flex-wrap bg-white/40 p-3 rounded-2xl gap-x-3 gap-y-2">
                        {instantMessages?.map((im, i) => (
                            <MessageChip  
                                key={i} 
                                message={im}
                                customMessageHandler={() => removeIMHandler(im, i)}  
                            />
                        ))}
                        {instantMessages?.length === 0 && <p className="text-xs text-black/60">Add message</p>}
                    </div>
                    
                    {/* low heading + clear button */}
                    <div className="relative flex items-center w-full">
                        <p className="text-xs text-center w-full text-black/60">*Click or tap on messages to remove it.</p>
                        <img 
                            onClick={clearKey}
                            className="absolute right-2 -top-0.5 hover:scale-105 active:scale-95 transition-all duration-100" 
                            src="/assets/icons/replay.svg" 
                            alt="replay" />
                    </div>

                    <form 
                        className="flex flex-col items-center gap-y-3 w-full"
                        onSubmit={addIMHandler}
                    >
                        {/* input field for capturing user response */}
                        <input 
                            className="focus:outline-none w-[90%] border-3 border-[#aa336a] rounded-xl px-3 py-2"
                            placeholder="Type custom message" 
                            ref={inputRef}
                            type="text" 
                        />

                        {/* controller buttons */}
                        <div className="flex items-center justify-center gap-x-4 w-full">
                            
                            <button
                                type="button"
                                onClick={() => setInstantDialogState(false)} 
                                className="bg-white/70 rounded-2xl p-2 w-25 text-xl hover:scale-105 active:scale-95 transition-all duration-100"
                            >   
                                Cancel
                            </button>
                            
                            <button 
                                className="bg-[#aa336a] text-white rounded-2xl p-2 w-25 text-xl hover:scale-105 active:scale-95 transition-all duration-100"
                            >
                                Set
                            </button>
                        </div>
                    </form>
                </div>
            
            </div>
        </div>
    )
}

export default InstantMessageDialog;