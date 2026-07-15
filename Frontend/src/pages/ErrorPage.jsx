import { useNavigate } from "react-router-dom";
import errorHandler from "../utils/erroHandler";

const ErrorPage = () => {
    const navigate = useNavigate();
    const errorInfo = useErrorHandler();
    console.log(errorInfo);  

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center gap-y-5">
            <img className="w-70" src="/assets/illustrations/404-page-not-found.svg" alt="404" />
            <p className="text-9xl font-extrabold text-black/60">404</p>
            <p className="text-2xl font-extrabold text-black/80">Uh'oh, Page Not Found.</p>
            <button 
                onClick={() => navigate(-1)} 
                className="p-4 rounded-2xl bg-[#aa336a] text-white font-bold hover:scale-105 active:scale-95 transition-all duration-200"
            >
                Take me back
            </button>
        </div>
    )
}

export default ErrorPage;