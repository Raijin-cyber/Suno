// auth
import { useEffect, useState } from "react";
import reqMsgHandler from "../utils/reqMsgHandler";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/authServices";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/authSlice";

const Auth = () => {
    const [authMode, setAuthMode] = useState("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const status = useSelector((state) => state.auth.status);

    useEffect(() => {
        status && navigate("/home");
    }, [])

    const registerFormHandler = (formData) => {
        setIsLoading(true);
        const { username, email, password } = formData;
        registerUser(username, email, password)
        .then(() => {
            loginUser(email, password)
            .then(() => {
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
                navigate("/home");
            }
        })
        .catch((err) => {
            setError(reqMsgHandler(err.status));
        })
        .finally(() => setIsLoading(false))
    }

    return(
        <div className="flex flex-col justify-center items-center">
            {/* images */}
            {authMode === "login" && <div className=""><img className="h-96 w-full" src="/assets/illustrations/ch4.jpg" /></div>}
            {authMode === "createAccount" && <div className=""><img className="h-85 w-full" src="/assets/illustrations/ch6.jpg" /></div>}
            
            {/* error message */}
            {error && <span className="text-red-800 text-xs font-semibold">{error}</span>}

            {/* Register */}
            {authMode === "createAccount" && <Form onSubmitHandler={registerFormHandler} loadingState={isLoading} onSendAuthMode={setAuthMode} username={true} email={true} password={true}/>}

            {/* Login */}
            {authMode === "login" && <Form onSubmitHandler={loginFormHandler} loadingState={isLoading} onSendAuthMode={setAuthMode} email={true} password={true}/>}
        </div>
    )
}

export default Auth;