import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Welcome = () => {
    const status = useSelector((state) => state.auth.status);
    const contentBlocks = ["About", "Features", "Demo", "Download"];
    const messages = [
        {
            msg: "Hello John!",
            time: "7:46pm",
            sender: false,            
        },
        {
            msg: "Hi Will!",
            time: "7:46pm",
            sender: true,
        },
        {
            msg: "How r you doing john?",
            time: "7:47pm",
            sender: false,
        },
        {
            msg: "Goood, wby?",
            time: "7:48pm",
            sender: true,
        },
        {
            msg: "How r you doing john?",
            time: "7:48pm",
            sender: false,
        },
        {
            msg: "Me good too?",
            time: "7:49pm",
            sender: false,
        },
    ]

    const navigate = useNavigate();
    useEffect(() => {
        status && navigate("/home");
    }, [])

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <header className="flex justify-around mt-8 w-75 sm:w-150 md:w-175 py-3 md:py-4 px-3 md:px-4 text-sm md:text-lg rounded-[29px] bg-linear-to-br from-[#ff9ebb] to-[#e3859e] shadow-[-8px_8px_16px_#e5879f,8px_-8px_16px_#ffa1bf]">
                {contentBlocks.map((blocks, index) => <span className="font-light cursor-pointer" key={index}>{blocks}</span>)}
                <Link className="font-light" to={`${status ? "/home" : "/auth"}`}>{`${status ? "Home" : "Login"}`}</Link>
            </header>

            {/* Hero Section */}
            <main className="w-full h-200 md:h-150 mt-[30%] sm:mt-[20%] md:mt-[10%] mb-[8%]">
                <div className="md:justify-around h-full flex flex-col md:flex md:flex-row items-center">
                    <div className="md:self-start flex flex-col w-80 mb-[30%] sm:mb-[20%]">
                        <p className="text-8xl md:text-9xl md:text-left text-center tracking-tighter">Suno.</p>
                        <b className="md:text-xl md:text-left text-center tracking-tight">Fast, reliable, and secure communication.</b>
                        <i className="md:text-xl block md:text-left text-center tracking-tighter">A modern chat experience designed for simplicity, speed, and style — where every conversation feels personal and polished.</i>
                    </div>
                    {/* Mobile phone */}
                    <div class="md:self-end md:scale-120 overflow-y-scroll scrollbar-hide overflow-x-hidden scrollbar-hide relative flex flex-col items-center h-100 w-60 px-3 rounded-[25px] bg-[#fc94af] border">
                        {/* top panel */}
                        <div className="sticky top-3 flex items-center justify-between rounded-2xl w-55 h-14 py-2 px-2 backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]">
                            <div className="flex items-center gap-x-3">
                                <div className="rounded-full object-cover h-10 w-10"><img src="/assets/icons/panda.png" alt="Panda" /></div>
                                <div className="flex flex-col font-light text-xs items-start">
                                    <span>Will Joss</span>
                                    <span className="text-[0.5rem]">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <div className="rounded-full object-cover h-4 w-4"><img src="/assets/icons/video.png" alt="Panda" /></div>
                                <div className="rounded-full object-cover h-3 w-3"><img src="/assets/icons/call.png" alt="Panda" /></div>
                                <div className="rounded-full object-cover h-3 w-3"><img src="/assets/icons/dots.png" alt="Panda" /></div>
                            </div>
                        </div>
                        <div className="flex flex-col py-3 space-y-4 scrollbar-hide w-full my-3 px-1">
                            {messages.map((msg, index) => (
                                <span
                                    key={index}
                                    className={`flex flex-col space-y-1 text-xs px-3 py-2 rounded-lg ${
                                        msg.sender
                                        ? "self-end bg-[#fc94af] shadow-[inset_2px_2px_1px_#e0849c,inset_-2px_-2px_2px_#ffb9cf]"
                                        : "self-start bg-[#fc94af] shadow-[2px_2px_1px_#e0849c,-1px_-1px_2px_#ffd0de]"
                                    }`}
                                >
                                    <p className="text-xs">{msg.msg}</p>
                                    <span className="self-end font-extralight text-[0.5rem]">{msg.time}</span>
                                </span>
                            ))}
                        </div>

                        {/* message typing area */}
                        <div className="sticky bottom-3 w-55 flex items-center space-x-1">
                            <button disabled={true} className="h-8 w-8 p-2 flex justify-center items-center rounded-full obejct cover backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]"><img src="/assets/icons/plus.png" alt="add" /></button>
                            <div className="h-full pr-3 w-[81.5%] rounded-3xl flex items-center backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)]">
                                <input disabled={true} value={"Go checkout this out."} className="px-2 py-2 text-xs outline-none" type="text" placeholder="Type a message" name="input" id="input" />
                                <button disabled={true} className=""><img src="/assets/icons/send.png" alt="send" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Feature Section */}
            <main className="flex flex-col items-center md:items-start w-full h-200 md:ml-40">
                <p className="md:text-left text-center md:text-8xl text-6xl">Features:</p>
                <p className="md:text-left text-center md:text-2xl text-xl w-[90%]">Use of web sockets make communication real time</p>
            </main>
        </div>
    )
}

export default Welcome;