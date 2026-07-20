import { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddUserProfile = ({
    userData,
    setError,
    recipientID=null,
    isVerified=false,
    recipientAvatar=null,
    recipientBio="Hello, I am engineer", 
    recipientName='',
    recipientUsername='jojoMishra',
}) => {
    const { mode } = useParams();
    const navigate = useNavigate();
    const [isAdded, setIsAdded] = useState(false);

    const handleProfileNavigation = useCallback(() => {
        navigate();
    }, []);
    const requestHandler = useCallback(async () => {
        sendRequest(userData?._id, recipientID)
            .then((res) => {
                const requestId = res?.result._id;
                setRequestBtnState(true);
                sendNotification(recipientID, "request", requestId).then(() =>
                    setRequestBtnState(false)
                );
            })
            .catch((error) => setError(error));
    }, [userData, recipientID, setError]);

    return(
        <div 
            className="w-full p-3 bg-white/25 backdrop-blur-sm rounded-4xl border-none shadow-[0_0_60px_10px_rgba(0,0,0,0.15)]"
        >
            {/* user profile */}
            <div className="flex items-center justify-between w-full">
                {/* user metadata */}
                <div className="flex items-center gap-x-2 w-full">
                    {/* avatar */}
                    <div className="w-13 h-13 lg:w-15 lg:h-15">
                        <img className="rounded-full" src={recipientAvatar ? recipientAvatar : `/avatars/${recipientName[0]?.toUpperCase()}.png`} alt="avatar" />
                    </div>

                    {/* name + username + verified badge + bio */}
                    <div className="flex flex-col items-start h-fit w-[70%]">
                        <div className="flex items-center text-md gap-x-1">
                            <p 
                                onClick={handleProfileNavigation}
                                className="text-[1.2rem] lg:text-xl font-semibold truncate hover:underline cursor-pointer"
                            >
                                {recipientName}
                            </p>
                            {isVerified && 
                                <img 
                                    className="rounded-full w-5 h-5" 
                                    src="/assets/icons/verified.svg" 
                                    alt="verified" 
                                />
                            }
                        </div>                        
                        
                        <p className="text-xs lg:text-[0.8rem] text-black/70 truncate">{'@' + recipientUsername}</p>

                        <p className="font-normal text-[0.9rem] lg:text-[1.1rem] text-shadow-2xl truncate">
                            {recipientBio}
                        </p>
                    </div>
                </div>

                {/* add user button */}
                <button
                    onClick={() => setIsAdded(prev => !prev)} 
                    disabled={isAdded}
                    className={`
                        w-10 h-10 rounded-full 
                        ${!isAdded && "cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"} 
                    `}
                >
                    {isAdded ?
                        <img className="w-7 h-7" src="/assets/icons/person_added.svg" alt="added" />
                        : <img className="w-7 h-7" src={`/assets/icons/${mode === "direct" ? "person_add" : "group_add"}.svg`} alt="group" />
                    }
                </button>

            </div>
        </div>
    )
}

export default AddUserProfile;