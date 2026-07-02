import { useCallback, useEffect } from "react";
import { useSocket } from "./useSocket";
import listenForErrorforWs from "../socket/ErrorEvent";

const useListenForWSConnErrors = (setError) => {
    const socket = useSocket();
    
    const listener = useCallback(() => {
        const wsErrorMessageListener = listenForErrorforWs(socket, setError);
        return wsErrorMessageListener;
    }, []) 

    useEffect(() => {
        const wsErrorMessageListener = listener();
        return () => {
            wsErrorMessageListener();
        }
    }, [])
}

export default useListenForWSConnErrors;