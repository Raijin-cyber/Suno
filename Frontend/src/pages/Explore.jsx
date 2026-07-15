import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import useScreenWidth from "../hooks/useScreenWidth";

const FEATURES = [
    "ORBI",
    "Security & Privacy",
    "Real-Time Communication",
    "Smart Messaging",
    "AI-Powered Experience",
    "App-Like Performance",
    "Personalization",
];

const Explore = () => {
    const screenWidth = useScreenWidth();
    const sectionRefs = useRef([0, 1, 2, 3, 4, 5, 6]);
    const [navDrawer, setNavDrawer] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden font-sans">

            {/* Background */}
            <div
                className="
                    fixed inset-0 z-0
                    bg-cover bg-center saturate-110
                    animate-pulsing
                    animate-duration-9000
                    animate-iteration-count-infinite
                "
                style={{
                    backgroundImage: "url('/abstract_shapes/7.webp')",
                }}
            />

            {/* Navigation */}
            <nav
                className={`
                    fixed top-6 left-1/2 -translate-x-1/2 duration-200 transition-all
                    z-50 ${screenWidth <= 1024 && (navDrawer ? "h-90" : "h-14")}
                    lg:w-[90%] max-w-7xl
                    rounded-2xl
                    bg-pink-300/50
                    backdrop-blur-md
                    px-4 py-3
                    flex flex-col lg:flex-row items-center lg:gap-x-3
                    overflow-x-auto scrollbar-hide max-lg:gap-y-3
                `}
            >
                {/* close and open button */}
                { screenWidth <= 1024 && 
                    <button 
                        onClick={() => setNavDrawer((prev) => !prev)}
                        className="absolute top-4 right-4 active:bg-black/30 rounded-full px-1.5 transition-all duration-200"
                    >
                        {
                            navDrawer ? <i className="fa-solid fa-angle-up" /> : <i className="fa-solid fa-angle-down" /> 
                        }
                    </button>
                }

                {FEATURES.map((feature, i) => (
                    <button
                        key={feature}
                        onClick={() => {
                            setActiveIndex(i);
                            sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`
                            whitespace-nowrap
                            rounded-xl
                            px-4 py-2 text-xs md:text-xs lg:text-[1rem]
                            transition-all
                            duration-300
                            ${
                                activeIndex === i
                                    ? "bg-[#66023C] text-white"
                                    : "hover:bg-white/30"
                            }
                        `}
                    >
                        {feature}
                    </button>
                ))}

                <Link to="/" className="ml-auto shrink-0">
                    <img
                        src="/logos/header.png"
                        alt="ORBI Logo"
                        className="w-8 lg:w-14 transition-transform hover:scale-105 active:scale-95"
                    />
                </Link>
            </nav>

            {/* Hero */}
            <section ref={(el) => (sectionRefs.current[0] = el)} className="relative flex h-screen items-center justify-center">

                <h1
                    className="
                        max-w-8xl z-10
                        px-6
                        text-center
                        text-4xl
                        font-serif
                        leading-tight
                        text-black
                        md:text-6xl
                        lg:text-9xl
                    "
                >
                    <Typewriter
                        options={{
                            autoStart: true,
                            loop: true,
                            delay: 70,
                        }}
                        onInit={(typewriter) => {
                            typewriter
                                .typeString("Secure.")
                                .pauseFor(1500)
                                .deleteChars(7)
                                .typeString("Instant.")
                                .pauseFor(1500)
                                .deleteChars(8)
                                .typeString("Smart.")
                                .pauseFor(1500)
                                .deleteChars(6)
                                .typeString("Intelligent.")
                                .pauseFor(1500)
                                .deleteChars(12)
                                .typeString("Seamless.")
                                .pauseFor(1500)
                                .deleteChars(9)
                                .typeString("Personalized.")
                                .pauseFor(1500)
                                .deleteAll()
                                .start();
                        }}
                    />
                </h1>

                {/* Scroll Indicator */}
                <div
                    className="
                        absolute
                        bottom-10
                        left-1/2
                        -translate-x-1/2
                        flex
                        flex-col
                        items-center
                        gap-3
                    "
                >
                    <i className="fa-solid fa-angles-down animate-bounce text-xl text-black/80"></i>
                    <p className="text-black/80">Scroll Down</p>
                </div>
            </section>

            {/* Feature Section */}
            
            {/* security and privacy */}
            <section
                ref={(el) => (sectionRefs.current[1] = el)}
                className="
                    relative flex flex-col items-center gap-y-5 mx-auto max-w-7xl px-6 py-24 z-20 scrollbar-hide
                "
            >
                <img
                    src="/assets/explore/secure&privacy.webp"
                    alt="Security and Privacy"
                    className="mx-auto w-full max-w-2xl rounded-3xl"
                />
                <h3 className="text-8xl text-center">Security and Privacy</h3>
                <p className="text-2xl text-center max-w-4xl">
                    ORBI protects every message with end‑to‑end encryption, 
                    ensuring only you and your recipient can read them. 
                    With tools to block users, delete conversations, 
                    and control your privacy,
                    you stay in charge of your chat space. 
                    <Link 
                        className="ml-2 underline text-pink-800 hover:text-pink-900"
                        to={"/manual"} 
                        target="_blank" 
                        rel="noopener noreferrer">
                            Learn More.
                    </Link>
                </p>
            </section>

            {/* real-time communication */}
            <section
                ref={(el) => (sectionRefs.current[2] = el)}
                className="
                
                "
            >

            </section>
        </div>
    );
};

export default Explore;