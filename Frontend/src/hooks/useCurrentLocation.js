import { useCallback, useEffect, useState } from "react";

const useCurrentLocation = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getLocation = useCallback(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position?.coords.latitude);
            setLongitude(position?.coords.longitude);
            setLoading(false);
        }, (error) => {
            setError(error);
            setLoading(false);
        }, { timeout: 60000 * 60 })
    }, [])

    useEffect(() => {
        getLocation();
    }, []);

    return { latitude, longitude, error, loading };
}

export default useCurrentLocation;