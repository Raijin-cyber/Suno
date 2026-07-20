const Categories = ({ setCategory }) => {
    return (
        <div className="flex items-center">
            <i onClick={() => setCategory("smileys and emotions")} className="active:bg-black/20 rounded-md p-2 text-center cursor-pointer fa-regular fa-face-smile-beam"></i>
            <i onClick={() => setCategory("People")} className="active:bg-black/20 rounded-md p-2 text-center cursor-pointer text-black/80 fa-solid fa-person"></i>
            <i onClick={() => setCategory("animals and nature")} className="active:bg-black/20 rounded-md p-2 text-center cursor-pointer text-black/80 fa-solid fa-mountain"></i>
            <i onClick={() => setCategory("food and drink")} className="active:bg-black/20 rounded-md p-2 text-center cursor-pointer text-black/80 fa-solid fa-cookie-bite"></i>
            <i onClick={() => setCategory("travel and places")} className="active:bg-black/20 rounded-md p-2 text-center cursor-pointer text-black/80 fa-solid fa-bus"></i>
            <i onClick={() => setCategory("activities and events")} className="active:bg-black/20 rounded-md p-2 text-center cursor-pointer text-black/80 fa-solid fa-table-tennis-paddle-ball"></i>
            <i onClick={() => setCategory("Objects")} className="active:bg-black/20 rounded-md p-2 text-center cursor-pointer text-black/80 fa-solid fa-cube"></i>
            <i onClick={() => setCategory("Symbols")} className="active:bg-black/20 rounded-md p-2 text-center cursor-pointer text-black/80 fa-solid fa-diamond"></i>
            <i onClick={() => setCategory("Flags")} className="active:bg-black/20 rounded-md p-2 text-center cursor-pointer text-black/80 fa-solid fa-flag"></i>
        </div>
    )
}

export default Categories;