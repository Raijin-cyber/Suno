import { useState } from "react";
import Chatsnippet from "../components/Chatsnippet";
import { useOutletContext } from "react-router-dom";
import Loader from "../components/Loader";

// In this page user object is importing coming from the search engine

const UserSearchPage = () => {
    const { mode, users, loading } = useOutletContext();
    return(
        <div className="relative flex flex-col gap-y-3 h-full">
            {users && 
                users.map((user) => (
                    <Chatsnippet key={user._id} userID={user._id} recipientAvatar={user.avatar} recipientName={user.username} />
                ))
            }
            {loading &&
                <div className="h-full w-full flex flex-col justify-start items-center">
                    <Loader loadingState={loading} />
                </div>
            }
        </div>
    )
}

export default UserSearchPage;