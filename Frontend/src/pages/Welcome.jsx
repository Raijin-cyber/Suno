// main.jsx
import {Link} from "react-router-dom";
  
const Welcome = () => {
return (
    <div className="relative min-h-screen w-full px-5 py-5 lg:px-20 lg:py-5 flex flex-col font-sans overflow-hidden">
        
        {/* background images */}
            <div
                className="absolute inset-0 bg-cover bg-center
                    animate-pulsing animate-iteration-count-infinite animate-duration-9000
                "
                style={{
                    backgroundImage: "url('/abstract_shapes/1.webp')"
                }}
            />

        {/* logo, download, github */}
        <div className="flex justify-between z-10 w-full">  
            <img className="w-25 lg:w-35 p-2 hover:scale-105 active:scale-95 transition-all duration-200" src="/logos/header.png" alt="logo" />
            
            <div className="flex items-center gap-x-3 lg:gap-x-5">
                <button 
                    className="
                        text-white bg-[#d53f77] lg:text-xl text-[0.9rem] px-4 py-3 rounded-4xl
                        hover:scale-105 active:scale-95 transition-all duration-200
                    "
                >
                    Download
                </button>
                <Link to={"https://github.com/Raijin-cyber/Suno"} target="_blank" rel="noopener noreferrer">
                    <i 
                        className="
                            fa-brands fa-github lg:text-4xl text-2xl 
                            hover:scale-105 active:scale-95 transition-all duration-200
                    "></i>
                </Link>
            </div>
        </div>

        {/* heading, sub-heading, CTA, Explore */}
        <div className="absolute top-50 lg:top-65 flex flex-col items-start gap-y-4 z-10">
            <p 
                className="text-6xl lg:text-8xl"
            >
                Chatting at its Peak.
            </p>
            <p
                className="text-2xl lg:text-4xl"
            >
                Fast, secure, limitless, and rich features — this is what peak messaging feels like.</p>
            <div className="flex items-center gap-x-2 lg:gap-x-5">
                <Link
                    to={"/auth"}
                    className="
                        text-[0.9rem] md:text-xl rounded-4xl text-center bg-[#d53f77] py-2 px-3 md:py-3 md:px-5
                        text-white md:mt-7 hover:scale-105 active:scale-95 transition-all duration-200
                    "
                >
                    Start Chatting
                </Link>
                <Link
                    to={"/explore"}
                    className="
                        bg-white py-2 px-3 md:py-3 md:px-5 rounded-4xl border-4 text-center border-[#2085ff]
                        hover:scale-105 active:scale-95 transition-all duration-200 md:text-xl text-[0.9rem] md:mt-7
                    "
                >
                    <div className="flex items-center gap-x-2">
                        Explore <img className="w-5 saturate-200" src="/assets/icons/sparkling_stars.png" alt="stars" />
                    </div>
                </Link>
            </div>
        </div>

        {/* social handles, bottom links, terms and conditions, career */}
        <div className="absolute bottom-10 flex flex-col md:flex-row gap-y-2 justify-between items-center w-[90%] p-5">
            <div className="flex items-center gap-x-6 md:gap-x-10 z-10 text-2xl md:text-3xl">
                <i className="fa-brands fa-instagram hover:scale-110 active:scale-95 transition-all duration-200"></i>
                <i className="fa-brands fa-x-twitter hover:scale-110 active:scale-95 transition-all duration-200"></i>
                <i className="fa-brands fa-facebook-f hover:scale-110 active:scale-95 transition-all duration-200"></i>
            </div>

            <div className="flex items-center text-xs md:text-[1rem] gap-x-3 md:gap-x-10 text-black/50">
                <Link className="hover:text-black/80">Terms of Service</Link>
                <Link className="hover:text-black/80">Legal</Link>
                <Link className="hover:text-black/80">Career</Link>
                <Link className="hover:text-black/80">Support</Link>
                <Link className="hover:text-black/80">Credit</Link>
            </div>
        </div>

        {/* copyright trademark sign */}
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-xs w-full text-center text-black/50">
            <i className="fa-regular fa-copyright mx-2"></i>
            2026 Orbi. All rights reserved.
        </p>
    </div>
)}
export default Welcome;