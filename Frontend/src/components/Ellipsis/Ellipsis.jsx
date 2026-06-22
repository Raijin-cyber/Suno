import { useCallback, useEffect, useRef, useState } from "react";

const Ellipsis = ({ 
        ellipsisState, 
        setEllipsisState, 
        ellipsisBtnRef, 
        items 
}) => {
    const ref = useRef();
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
    const focusLossCloseHandler = useCallback((event) => {
        if (
            ref.current &&
            !ref.current.contains(event.target) &&
            !ellipsisBtnRef.current?.contains(event.target)
        ) {
            setEllipsisState(false);
        }
    }, [ellipsisBtnRef, setEllipsisState]);
    useEffect(() => {
        document.addEventListener("mousedown", focusLossCloseHandler);
        return () => document.removeEventListener("mousedown", focusLossCloseHandler)
    }, [])

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
                <div className="flex flex-col items-start gap-y-3 p-3 text-white/85">
                    <span className="cursor-pointer">View profile</span>
                    <span className="cursor-pointer">Notifications</span>
                    <span className="cursor-pointer">Language</span>
                    <span className="cursor-pointer">Clear cache</span>
                    <span className="cursor-pointer">Settings</span>
                    <span className="cursor-pointer">Support</span>
                </div>
        </div>
    )
}

export default Ellipsis;