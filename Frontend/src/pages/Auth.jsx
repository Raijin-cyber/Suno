import Form from "../components/Form";
import { login } from "../store/authSlice";
import formatTime from "../utils/formatTime";
import { useSocket } from "../hooks/useSocket";
import { Link, useNavigate } from "react-router-dom";
import reqMsgHandler from "../utils/reqMsgHandler";
import useScreenWidth from "../hooks/useScreenWidth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { registerUser, loginUser } from "../services/authServices";

const currentTime = formatTime(new Date());
const reactions = [
    {
        registerMessage: "Hello there!", 
        loginMessage: "Welcom back!", 
        emoji: "/emojis-library/Smileys-and-emotions/Heart-face_u1f970.json"
    },
    {
        registerMessage: "Welcom to ORBI.", 
        loginMessage: "Yayyyyy! You came back.", 
        emoji: "/emojis-library/Smileys-and-emotions/Partying-face_u1f973.json"
    },
    {
        registerMessage: "Helloooooo!", 
        loginMessage: "Hellooo there!", 
        emoji: "/emojis-library/Smileys-and-emotions/Melting_u1fae0.json"
    },
    {
        registerMessage: "Welcome aboard — ORBI’s got your back.", 
        loginMessage: "We were missing you.", 
        emoji: "/emojis-library/Smileys-and-emotions/Holding-back-tears_u1f979.json"
    },
    {
        registerMessage: "Nice to meet you explorer!", 
        loginMessage: "Welcome back friend!", 
        emoji: "/emojis-library/Smileys-and-emotions/Warm-smile_u263a_fe0f.json"
    },
    {
        registerMessage: "Finally someone! Welcome to ORBI.", 
        loginMessage: "Hope you are doing good.", 
        emoji: "/emojis-library/Smileys-and-emotions/Relieved_u1f60c.json"
    },
    {
        registerMessage: "Yessss... you are making the right decision.", 
        loginMessage: "Just do it.", 
        emoji: "/emojis-library/Smileys-and-emotions/Head-nod_u1f642_200d_2195_fe0f.json"
    },
    {
        registerMessage: "Nice to see you.", 
        loginMessage: "Huhh... youu!", 
        emoji: "/emojis-library/Smileys-and-emotions/Smirk_u1f60f.json"
    },
]

const Auth = () => {
    const [message, setMessage] = useState(() => reactions[Math.floor((Math.random() * reactions.length))]);
    const status = useSelector((state) => state.auth?.status);
    const [authMode, setAuthMode] = useState("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const screenWidth = useScreenWidth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = useSocket();

    // check if user had any prev sessions.
    useEffect(() => {
        if (status) navigate("/home");
    }, [status, navigate]);

    const completeAuth = useCallback((userData) => {
        dispatch(login({ userData }));
        if (!socket.connected) socket.connect();
        navigate("/home");
    });

    const registerFormHandler = useCallback(async({ username, email, password }) => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await registerUser(username, email, password);
            console.log(user)
            // execute this when user didn't return
            if(user?.status === 200) {
                const res = await loginUser(email, password);
                completeAuth(res?.data?.userData);
                return;
            }
            throw new Error("Something went wrong!");
        } catch (err) {
            setError(err?.status ? reqMsgHandler(err?.status) : err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loginFormHandler = useCallback(async({ email, password }) => {
        setIsLoading(true);
        setError("");
        try {
            const res = await loginUser(email, password);
            completeAuth(res.data.userData);
        } catch (err) {
            setError(err.status ? reqMsgHandler(err.status) : err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className=" relative flex items-center justify-center h-screen">
            {/* logo */}
            {screenWidth >= 768 &&
                <Link to={"/"}><img className="absolute top-10 left-27 w-25 hover:scale-110 active:scale-90 transition-all duration-200" src="/logos/header.png" alt="logo" /></ Link>
            }

            <div className="relative flex items-center md:gap-x-20 lg:gap-x-35">
                {/* visitor message */}
                {screenWidth >= 768 && 
                    <div
                        className="
                            flex flex-col items-start gap-y-10 rounded-3xl
                        "
                    >   
                        {/* message */}
                        <p
                            className="
                                font-semibold text-3xl text-left py-7 px-6 rounded-3xl relative
                                bg-[linear-gradient(145deg,rgb(239,141,166),rgb(255,155,184))] max-w-md 
                                shadow-[-5px_-5px_0px_rgb(222,130,154),5px_5px_0px_rgb(255,166,196)]
                            "
                        >
                            {
                                authMode === "login" ?
                                message?.loginMessage :
                                message?.registerMessage
                            }

                            {/* time */}
                            <span className="absolute bottom-2 right-3 z-10 text-xs text-black/50">{currentTime}</span>
                        </p>

                        {/* emoji player */}
                        <div
                            className="
                                p-2 rounded-3xl relative
                                bg-[linear-gradient(145deg,rgb(239,141,166),rgb(255,155,184))] 
                                shadow-[-5px_-5px_0px_rgb(222,130,154),5px_5px_0px_rgb(255,166,196)]
                            "   
                        >
                            <DotLottieReact 
                                src={message?.emoji}
                                autoplay={true}
                                loop={true}                        
                                useFrameInterpolation={true}
                                renderConfig={{
                                    devicePixelRatio: 1,
                                }}
                            />

                            {/* time */}
                            <span className="absolute bottom-2 right-3 z-10 text-xs text-black/50">{currentTime}</span>
                        </div>
                    </div>
                }

                {/* login / register */}
                <div className="relative flex items-center justify-center overflow-hidden rounded-3xl">
                    {/* background image */}
                    <div
                        className="
                            absolute w-full h-full inset-0 bg-center bg-cover bg-no-repeat left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
                            animate-pulsing animate-iteration-count-infinite animate-duration-5000 saturate-120
                        "
                        style={{ backgroundImage: "url('/abstract_shapes/7.webp')" }}
                    />

                    {/* auth */}
                    <div className="pt-10 backdrop-blur-[10px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)] p-6 shadow-lg rounded-3xl">
                    
                    {/* header */}
                        <h2 
                            className="text-3xl font-semibold tracking-wide w-full text-left"
                        >
                            {authMode === "login" ? "Login" : "Register"}
                        </h2>

                        
                        
                        <Form
                            onSubmitHandler={authMode === "createAccount" ? registerFormHandler : loginFormHandler}
                            loadingState={isLoading}
                            onSendAuthMode={setAuthMode}
                            username={authMode === "createAccount"}
                            email
                            password
                            error={error}
                            setError={setError}
                        />

                        {/* OAuth Logins */}
                        <div className="flex flex-col items-center gap-y-3 w-full mt-3">
                            <a
                                href={import.meta.env.VITE_API_BASE_URL + "auth/google"}
                                className="flex items-center justify-center cursor-pointer bg-white w-full rounded-xl active:scale-97 transition-all duration-200"    
                            >
                                <span className="flex items-center  justify-center gap-x-2 h-12">
                                    {authMode === "login" ? "Login with Google" : "Sign in with Google"}
                                    <img className="w-7" src="/assets/icons/google.svg" alt="google"/>
                                </span>
                            </a>
                            <a
                                href={import.meta.env.VITE_API_BASE_URL + "auth/github"}
                                className="flex items-center justify-center cursor-pointer bg-white w-full rounded-xl h-12 active:scale-97 transition-all duration-200"
                            >
                                <span className="flex items-center justify-center gap-x-2">
                                    {authMode === "login" ? "Login with Github" : "Sign in with Github"}
                                    <img className="w-7" src="/assets/icons/github.svg" alt="github"/>
                                </span>
                            </a>
                        </div>

                        {/* *terms&conditions apply */}
                        <p className="text-center mt-3 text-xs text-black/50">*Terms & Conditions apply</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Auth;