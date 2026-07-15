import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { searchUser } from "../services/authServices";
import Chatsnippet from "../components/ChatSnippet/Chatsnippet";
import CsShimmerUI from "../components/ChatSnippet/CsShimmerUI";
import { useSelector } from "react-redux";

const UserSearchPage = () => {
    const searchTimeout = useRef(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector(state => state.auth.userData);
    const { convoType, searchQuery, setError } = useOutletContext();

    useEffect(() => {
        if(searchQuery === null || searchQuery === ''){
            setLoading(false);
            setUsers([]);
            return;
        }
        setLoading(true);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            searchUser(searchQuery)
            .then((u) => setUsers(u))
            .catch((e) => setError(e))
            .finally(() => setLoading(false));
        }, 800);

        return () => clearTimeout(searchTimeout.current);
    }, [searchQuery])

    return(
        <div className="relative flex flex-col gap-y-3 h-full">
            {Array.isArray(users) && !loading && 
                users?.map((user) => (
                    <div
                        key={user?._id}
                        className="animate-fade-in-down animate-duration-300 animate-ease-out"
                    >
                        <Chatsnippet 
                            userData={userData}
                            setError={setError} 
                            recipientID={user?._id} 
                            recipientAvatar={user?.avatar} 
                            recipientName={user?.username}
                        />
                    </div>
                ))
            }

            {/* message */}
            {!loading &&
                <div className="text-[1rem] text-center text-black/60 h-full w-full flex items-center justify-center">
                    {users?.length === 0 && !searchQuery && <p className="animate-fade-in animate-duration-200">Search for users.</p>}
                    {users?.length === 0 && searchQuery && <p className="animate-fade-in animate-duration-200">No user found with that username.</p>}
                </div>

            }

            <div className="flex-1 w-full overflow-y-auto gap-y-3 flex flex-col justify-start items-center animate-fade-in animate-duration-500">
                {Array.from({ length: 6 }, (_, i) => (
                    <CsShimmerUI key={i} value={i} loadingState={loading} />
                ))}
            </div>

        </div>
    )
}

export default UserSearchPage;