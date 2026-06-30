import Emoji from "./Emoji";
import { Grid } from "react-window";
import { memo, useMemo, useState } from "react";

const cellComponent = memo(
    function EmojiCell({
    rowIndex,
    columnIndex,
    style,
    setEmoji,
    categorised_emojis,
}) {
    const columns = 8;
    const index = rowIndex * columns + columnIndex;
    const [animationState, setAnimationState] = useState(false);

    if (index >= categorised_emojis.length) return null;

    return (
        <Emoji
            style={style}
            setEmoji={setEmoji} 
            animateState={animationState}
            file={categorised_emojis[index].file} 
            emoji={categorised_emojis[index].emoji} 
            setAnimationState={setAnimationState}
        />
    );
})

function VirtualizedGrid({setEmoji, categorised_emojis = []}) {
    const columns = 8;
    const rows = Math.ceil(categorised_emojis?.length / columns) || 0;

    return (
        <Grid
            rowHeight={37}
            rowCount={rows}
            columnWidth={37}
            overscanCount={4}
            columnCount={columns}
            className="scrollbar-hide"
            cellComponent={cellComponent}
            cellProps={{ categorised_emojis, setEmoji }}
            style={{
                height: "13rem",
                width: "19rem"
            }}
        />
    );
}

export default VirtualizedGrid;