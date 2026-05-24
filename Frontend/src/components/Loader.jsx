const Loader = ({loadingState}) => {
    return (
        <div>
            {loadingState &&
                <div className="relative flex items-center justify-center h-15 w-15 rounded-full border-t border-none bg-[#fc94Af] shadow-[inset_5px_5px_4px_#de829a,inset_-4px_-4px_5px_#ffa6c4]">
                    {/* spinner */}
                    <div className="animate-impulse-rotation-left animate-duration-750 animate-iteration-count-infinite h-15 w-15 border-10 rounded-full border-t-transparent border-r-transparent border-b-transparent border-[#ffffff]">

                    </div>

                    {/* spinner cover */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-[2px_2px_5px_#b56b7e,-2px_-2px_5px_#ffbde0]">

                    </div>
                </div>
            }
        </div>
    )
}

export default Loader;