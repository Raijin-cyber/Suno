import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";

const Ellipsis = ({ 
        ellipsisState, 
        setEllipsisState, 
        ellipsisBtnRef, 
        items 
}) => {
    const ref = useRef();
    const navigate = useNavigate();
    
    useEffect(() => {
        let animationTimeout;
        if(!ellipsisState) {
            animationTimeout = setTimeout(() => {
                if (ref.current) {
                    ref.current.style.display = "none";
                }
            }, 200);
        }
        else {
            if (ref.current) {
                ref.current.style.display = "block";
            }
        }

        return () => clearTimeout(animationTimeout);
    }, [ellipsisState])

    useEffect(() => {
        document.addEventListener("mousedown", focusLossCloseHandler);
        return () => document.removeEventListener("mousedown", focusLossCloseHandler)
    }, [])

    const focusLossCloseHandler = useCallback((event) => {
        if (
            ref.current &&
            !ref.current.contains(event.target) &&
            !ellipsisBtnRef.current?.contains(event.target)
        ) {
            setEllipsisState(false);
        }
    }, [ellipsisBtnRef, setEllipsisState]);

    return ( 
        <div    
            id="ellipsis-menu-home"
            ref={ref}
            className={`
                absolute top-13 right-0 w-35
                rounded-xl flex flex-col font-normal text-[1.05rem] 
                backdrop-blur-[15px] backdrop-saturate-125 animate-duration-200
                bg-[rgba(0,0,0,0.7)] border border-[rgba(255,255,255,0.125)]
                ${ellipsisState ? "animate-fade-in-down" : "animate-fade-out-up"}
            `
        }>
                <div className="flex flex-col items-start text-white/85">
                    <span onClick={() => navigate(`/home/profile/:id/:userId`)} className="rounded-t-xl cursor-pointer hover:bg-white/10 active:bg-white/10 w-full p-2">View profile</span>
                    <span className="cursor-pointer hover:bg-white/10 active:bg-white/10 w-full p-2">Notifications</span>
                    <span className="cursor-pointer hover:bg-white/10 active:bg-white/10 w-full p-2">Language</span>
                    <span className="cursor-pointer hover:bg-white/10 active:bg-white/10 w-full p-2">Clear cache</span>
                    <span onClick={() => navigate(`/setting`)} className="cursor-pointer hover:bg-white/10 active:bg-white/10 w-full p-2">Settings</span>
                    <span onClick={() => navigate(`/credit`)} className="cursor-pointer hover:bg-white/10 active:bg-white/10 w-full p-2">Credits</span>
                    <span onClick={() => navigate(`/support`)} className="rounded-b-xl cursor-pointer hover:bg-white/10 active:bg-white/10 w-full p-2">Support</span>
                </div>
        </div>
    )
}

export default Ellipsis;