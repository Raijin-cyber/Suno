import Emoji from "./Emoji";
import { useEffect, useState } from "react";
import useKeyLocalStorage from "../../hooks/useKeyLocalStorage";
import useEmojiManifest from "../../hooks/useEmojiManifest";

const Recent = () => {
    const [count, setCount] = useState(0);
    const {
        storedValue: recentEmojis, 
        setValue: setRecentEmojis,
        clearKey,
        error, 
    } = useKeyLocalStorage("recent_emojis", []);

 return (
    <div className="flex flex-col gap-y-2">
        {recentEmojis?.length > 0 && 
            <div className="flex items-center justify-between">
                <span className="text-xs">Recently Used</span>
                <button
                    onClick={() => clearKey("recent_emojis")}
                    className="w-5 active:bg-black/30 rounded-full p-1">
                        <img src="/assets/icons/cross_black.png" alt="Cross" />
                </button>
            </div>
        }
        <div className="grid-flow-col gap-x-2">
            {recentEmojis?.map((f) => (<Emoji file={f} />))}
        </div>
    </div>
 )
}

export default Recent;