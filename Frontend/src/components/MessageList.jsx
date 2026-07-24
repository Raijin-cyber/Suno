import Chat from "./Chat/Chat";
import { memo, useEffect, useImperativeHandle } from "react";
import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";

const ROW_SIZE = 100;
const estimateSize = () => ROW_SIZE;

const MessageList = memo(({
    messageListRef,
    conversationMessages,
    conversationPane,
    setReferenceMessage,
    conversationContext,
    participant
}) => {
    const rowVirtualizer = useVirtualizer({
        count: conversationMessages.length || 0, // total items
        getScrollElement: () => conversationPane.current, // scroll container
        getItemKey: index => conversationMessages[index]?.messageId, // stable keys
        estimateSize, // fast size estimate
        overscan: 8, // render a few extra rows  
        gap: 10,                              
        anchorTo: 'end', // keep pinned to bottom (chat)
        followOnAppend: "smooth", // auto-scroll on new messages
        scrollEndThreshold: 10, // "at bottom" detection
        directDomUpdates: true,  
    });   
    const RowVirtualItems = rowVirtualizer.getVirtualItems();

    useImperativeHandle(messageListRef, () => ({
        scrollToEnd: (opts) => rowVirtualizer.scrollToEnd(opts),
        scrollToIndex: (i, opts) => rowVirtualizer.scrollToIndex(i, opts),
        isAtEnd: (threshold) => rowVirtualizer.isAtEnd(threshold),
        // you can expose the whole object if you want:
        virtualizer: rowVirtualizer,
    }));

return (
    <div
      style={{
        height: rowVirtualizer.getTotalSize(),
        width: "100%",
        position: "relative",
      }}
    >
      {RowVirtualItems.map((virtualRow) => {
        const idx = virtualRow.index;
        const msg = conversationMessages[idx];

        return (
            <div
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                key={virtualRow.key}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translate3d(0,${virtualRow.start}px,0)`,
                }}
            >
                <Chat
                    time={msg.time}
                    isOwn={msg.isOwn}
                    messageId={msg.messageId}
                    message={msg.message}
                    creator={msg.messageCreator}
                    referenceMessage={msg?.referenceMessage}
                    referenceMessageCreator={msg?.referenceMessageCreator}
                    setReferenceMessage={setReferenceMessage}
                    convoType={conversationContext?.convoType || "group"}
                    readReceipt={!!msg.readByAt[participant?._id] || false}
                />
            </div>
        );
    })}
    </div>
  );
});

export default MessageList;
