import { useCallback, useEffect, useState } from "react";
import useCurrentLocation from "./useCurrentLocation";

const useWeatherInfo = () => {
    const { latitude, longitude, error: locationError, loading: locationLoading } = useCurrentLocation();
    const [loading, setLoading] = useState(true);
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [error, setError] = useState(null);

    const fetchWeatherData = useCallback(() => {
        const reqUrl = `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}` + `&q=${latitude},${longitude}` + "&aqi=yes"
        fetch(reqUrl)
        .then(response => {
            if(!response.ok) {
                throw new Error("Something failed while fetching weather data.");
            }
            response.json()
            .then((parsedData) => setWeatherInfo(parsedData))
            .catch((error) => setError(error));
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        })
        .finally(() => setLoading(false));
    }, [latitude, longitude])

    useEffect(() => {
        fetchWeatherData();
    }, [latitude, longitude])

    return { weatherInfo, error, loading };
}

export default useWeatherInfo;