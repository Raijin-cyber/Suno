const AvatarPreview = ({ preview=null, setIsAvatarOpen }) => {
    return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black/80 z-10">
            {/* close button */}
            <img 
                onClick={() => setIsAvatarOpen(false)}
                className="absolute top-8 right-8 bg-white/35 rounded-full p-1"
                src="/assets/icons/close_white.svg" 
                alt="cross" 
            />

            <div className="flex items-center justify-center h-screen w-full">
                {/* actual image */}
                <img 
                    className="w-xl h-xl"
                    src={preview} 
                    alt="preview" 
                />
            </div>
        </div>
    )
}

export default AvatarPreview;