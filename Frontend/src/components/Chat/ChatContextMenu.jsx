import { useCallback, useEffect } from "react";

const ChatContextMenu = ({ chatContextRef, chatContextState, setChatContextState }) => {

    const handleCloseEventListener = useCallback((e) => {
        if(e.target !== chatContextRef.current) setChatContextState(false);
    }, []);

    useEffect(() => {
        document.addEventListener("click", handleCloseEventListener);
        return () => {
            window.removeEventListener("click", handleCloseEventListener);
            setChatContextState(false);
        }
    },[])

    return (
        chatContextState &&
        <div 
            className="
                absolute flex flex-col items-start justify-evenly 
                -top-50 -right-5 bg-[#ffffff]/20 backdrop-blur-xl h-fit text-[1.1rem] rounded-xl
            "
        > 
            <span className="flex items-center gap-x-3 cursor-pointer hover:bg-black/20 active:bg-black/20 w-full h-full px-3 py-1.5 rounded-t-xl">
                Pin
                <i className="fa-solid fa-thumbtack fa-xs"></i>
            </span>
            
            <span className="flex items-center gap-x-3 cursor-pointer hover:bg-black/20 active:bg-black/20 w-full h-full px-3 py-1.5">
                Edit
                <i className="fa-solid fa-pen fa-xs"></i>
            </span>
            
            <span className="flex items-center gap-x-3 cursor-pointer hover:bg-black/20 active:bg-black/20 w-full h-full px-3 py-1.5">
                Forward
                <i className="fa-solid fa-paper-plane fa-xs"></i>
            </span>

            <span className="flex items-center gap-x-3 cursor-pointer hover:bg-black/20 active:bg-black/20 w-full h-full px-3 py-1.5">
                Copy
                <i className="fa-solid fa-copy fa-xs"></i>
            </span>
            
            <span className="flex items-center gap-x-3 cursor-pointer hover:bg-black/20 active:bg-black/20 w-full h-full px-3 py-1.5 rounded-b-xl text-red-800">
                Delete
                <i className="fa-solid fa-trash-can fa-xs"></i>
            </span>
        </div>
    )
}

export default ChatContextMenu;