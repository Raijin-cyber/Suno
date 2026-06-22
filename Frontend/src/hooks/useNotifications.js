import { useState, useCallback, useEffect } from "react";
import { receiveNotification } from "../services/notificationServices";

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refresh = useCallback(() => {
        setLoading(true);
        receiveNotification()
        .then(n => setNotifications(n))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { notifications, error, loading, refresh };
}

export default useNotifications;