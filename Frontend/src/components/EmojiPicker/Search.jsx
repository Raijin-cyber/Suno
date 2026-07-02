const Search = ({ setSearchQuery }) => {
    return (
        <div 
            className="
                bg-pink-900/40 
                backdrop-blur-[10px] 
                backdrop-saturate-200
                border border-pink-400/30 
                rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]
            "
        >
            <input
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                    focus:outline-none py-1 px-2 w-full 
                " 
                placeholder="Search emoji"
                type="text"
            />
        </div>
    )
}

export default Search;