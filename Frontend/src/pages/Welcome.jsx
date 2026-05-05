import {Link} from "react-router-dom"

const Welcome = () => {
    return (
        <main className="flex flex-col items-center justify-center gap-y-10 h-screen">
            <div>
                <div className="flex lg:w-2xl">
                    <div className="block object-contain"><img src="/assets/illustrations/ch2.jpg"/></div>
                    <div className="block object-contain"><img src="/assets/illustrations/ch3.jpg"/></div>    
                </div>
                <p className="font-serif font-semibold text-[1.115rem] lg:text-[1.7rem] text-center">"Say hello to seamless chatting.”</p>
            </div>
            <div className="flex flex-col gap-y-2">
                <Link to={"/auth"} className="bg-[#ec6340] text-white font-semibold font-serif py-2 px-5 lg:py-3 lg:px-8 rounded-xl active:scale-[0.9] transition duration-75">Login</Link>
                <Link to={"/about"} className="bg-[#d9d9d9] font-semibold font-serif  py-2 px-5 lg:py-3 lg:px-8 rounded-xl active:scale-[0.9] transition duration-75">About</Link>
            </div>            
        </main>
    )
}

export default Welcome;