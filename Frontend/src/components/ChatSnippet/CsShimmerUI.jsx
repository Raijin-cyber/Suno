const CsShimmerUI = ({loadingState=false}) => {
    return(
        <>
            {loadingState && 
                <div className={`
                    shimmer
                    backdrop-blur-[1.5px] 
                    bg-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.1)] 
                    flex items-center justify-between w-full p-2 rounded-2xl
                `}>
                    <div className="flex items-center gap-3 w-[85%]">
                        {/* Avatar */}
                        <div className="w-12">
                            <img src="/assets/icons/user.png" />    
                        </div>    

                        {/* Main Content */}
                        <div className="flex flex-col flex-1 gap-y-2 items-start min-w-0">
                            <p className="font-semibold bg-black/50 h-[10px] w-[110px] rounded-xl"></p>
                            <p className="text-[0.85rem] bg-black/50 h-[10px] w-[50px] rounded-xl line-clamp-1 break-all"></p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default CsShimmerUI;