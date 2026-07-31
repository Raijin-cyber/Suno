import Search from "./Search";
import Recent from "./Recent";
import Categories from "./Categories";
import VirtualizedGrid from "./VirtualizedGrid";
import { sendMessage } from "../../socket/chat";
import { useSocket } from "../../hooks/useSocket";
import { useCallback, useEffect, useMemo, useState } from "react";
import useEmojiManifest from "../../hooks/useEmojiManifest";

const EmojiPicker = ({
    emojiPickerState=false, 
    setEmojiPickerState,
    emojiVisibleState=false,
    setEmojiVisibleState,
    messageCreator,
    conversationId,
    referenceMessage
}) => {
    const socket = useSocket();
    const [emoji, setEmoji] = useState(null);
    const { emojis, errors } = useEmojiManifest();
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState("smileys and emotions");
    
    const categorisedEmojis = useMemo(() => {
        return emojis.reduce((acc, emoji) => {
            if (!acc[emoji.category]) {
                acc[emoji.category] = [];
            }
            acc[emoji.category].push(emoji);
            return acc;
        }, {});
    }, [emojis]);

    useEffect(() => {
        if(!emoji) return;
        sendMessage(socket, { 
            conversationId: conversationId, 
            message: `${emoji?.file}&${emoji?.emoji}`,
            messageCreator: messageCreator,
            referenceMessageId: referenceMessage?.id,
            referenceMessage: referenceMessage?.message,
            referenceMessageCreator: referenceMessage?.creator
        })
    }, [emoji])

    return( emojiPickerState &&
        <div 
            id="emoji-picker"
            className={`
                flex flex-col gap-y-1.5
                absolute bottom-25 left-15 rounded-xl p-3 z-10 h-80 w-80 
                backdrop-blur-[1.5px] bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)] animate-duration-100
                ${emojiVisibleState ? "animate-fade-in-up" : "animate-fade-out-down"}
            `}
        >   
            {/* Search Bar */}
            <Search setSearchQuery={setSearchQuery} />

            {/* Categories */}
            <Categories setCategory={setCategory} />

            {/* Recently Used emojis */}
            <Recent />

            {/* Emojis listing based on selected category */}
            <VirtualizedGrid
                setEmoji={setEmoji}
                categorised_emojis={
                    categorisedEmojis[
                        category.toLowerCase()
                    ] || []
                }
            />

        </div>
    )
}

export default EmojiPicker;