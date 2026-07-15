import { memo, useCallback, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function Emoji({ setEmoji, file, emoji, style, animateState = false, setAnimationState }) {
    const playerRef = useRef(null);
    const playAnimation = useCallback(() => {
        if (animateState && !playerRef.current) return;
        playerRef.current.stop();
        playerRef.current.setFrame(0);
        playerRef.current.play();
    }, [animateState]);
    const setPlayer = useCallback(
        instance => {
            playerRef.current = instance;
        },
    []);

    return ( 
        <div 
            style={style}
            onClick={() => setEmoji({file, emoji})} 
            className={`
                flex items-center justify-center rounded-md w-60
                ${animateState & "hover:bg-black/30 active:bg-black/30"} 
            `}
        >
            {
                animateState ?
                (<DotLottieReact
                    src={file}
                    autoplay={true}
                    onClick={playAnimation}
                    useFrameInterpolation={false}
                    dotLottieRefCallback={setPlayer}
                    renderConfig={{
                        devicePixelRatio: 1.8,
                        autoResize: false
                    }}
                />)

                :

                (<span className="text-[1.675rem] cursor-pointer">{emoji}</span>)
            }
        </div>
    );
}

export default memo(Emoji);