// auth
import { useEffect, useState } from "react";
import reqMsgHandler from "../utils/reqMsgHandler";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/authServices";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { useSocket } from "../hooks/useSocket";

const Auth = () => {
    const [authMode, setAuthMode] = useState("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = useSocket();

    const status = useSelector((state) => state.auth.status);

    useEffect(() => {
        if(status) {
            navigate("/home");
        }
    }, [status])

    const registerFormHandler = (formData) => {
        setIsLoading(true);
        const { username, email, password } = formData;
        registerUser(username, email, password)
        .then(() => {
            loginUser(email, password)
            .then(() => {
                if(!socket.connected) socket.connect();
                setIsLoading(false);
                navigate("/home");
            })
            .finally(() => setIsLoading(false))
        })
        .finally(() => setIsLoading(false))
    }

    const loginFormHandler = (formData) => {
        setIsLoading(true);
        const { email, password } = formData;
        loginUser(email, password)
        .then((res) => {
            setIsLoading(false);
            if (res.status >= 200 && res.status < 300) {
                dispatch(login({userData: res.data.userData}));
                if(!socket.connected) socket.connect();    
                navigate("/home");
            }
        })
        .catch((err) => {
            setError(reqMsgHandler(err.status));
        })
        .finally(() => setIsLoading(false))
    }

    return(
        <div className="flex items-center justify-center h-screen">
            <div className="relative flex flex-col lg:flex-row scale-75 sm:scale-80 lg:scale-90 space-y-3 lg:space-x-15 items-center rounded-3xl p-10 bg-[#fc94Af] shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4]">
                {/* images */}
                {authMode === "login" && <div className="flex justify-center items-center"><img className="h-96 w-full" src="/assets/illustrations/Team work-bro.png" /></div>}
                {authMode === "createAccount" && <div className="flex justify-center items-center"><img className="h-85 w-full" src="/assets/illustrations/Team work-bro2.png" /></div>}
                
                {/* error message */}
                {error && <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-red-800 text-xs font-semibold">{error}</span>}

                {/* Register */}
                {authMode === "createAccount" && 
                    <div className="pt-10 backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)] p-6 shadow-lg rounded-3xl">
                        <Form onSubmitHandler={registerFormHandler} loadingState={isLoading} onSendAuthMode={setAuthMode} username={true} email={true} password={true}/>
                    </div>
                }

                {/* Login */}
                {authMode === "login" && 
                    <div className="backdrop-blur-[1.5px] backdrop-saturate-200% bg-[rgba(244,244,244,0.3)] border border-[rgba(255,255,255,0.1)] p-6 shadow-lg rounded-3xl">
                        <Form onSubmitHandler={loginFormHandler} loadingState={isLoading} onSendAuthMode={setAuthMode} email={true} password={true}/>
                    </div>
                }
            </div>
        </div>
    )
}

export default Auth;