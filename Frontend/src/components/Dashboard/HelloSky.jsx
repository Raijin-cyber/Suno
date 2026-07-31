import greetUser from "../../utils/greetUser";
import useWeatherInfo from "../../hooks/useWeatherInfo";
import { useCallback, useEffect, useRef, useState } from "react";

const HelloSky = ({ userData=null }) => {
    const ref = useRef();
    const [greet, setGreet] = useState(greetUser());
    const [helloSkyState, setHelloSkyState] = useState(false);
    const { weatherInfo, error, loading } = useWeatherInfo();

    const focusLossCloseHandler = useCallback((event) => {
        if (ref.current && !ref.current.contains(event.target)) setHelloSkyState(false);
    }, [ref]);

    useEffect(() => {
        document.addEventListener("mousedown", focusLossCloseHandler);
        return () => document.removeEventListener("mousedown", focusLossCloseHandler);
    }, [])

    useEffect(() => {
        const interval = setInterval(
            setGreet(greetUser()),
            60000 
        );
        return () => clearInterval(interval);
    }, []);

    return(
        <div 
            id="HelloSky"
            ref={ref}
            className={`
                absolute top-0 left-2
                scrollbar-hide z-20
                rounded-2xl p-2 flex flex-col gap-y-1
                cursor-pointer overflow-y-scroll
                transition-all duration-300 ease-in-out
                backdrop-blur-[5px] backdrop-saturate-125 
                bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.125)]
                ${helloSkyState ? "h-80 w-60" : "h-20 w-35 hover:scale-103"}
            `}
            onClick={() => setHelloSkyState(prev => !prev)}
        >   

            {/* upper block */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col items-start">
                    <span className="block w-full truncate text-[1rem] font-normal tracking-tighter animate-fade-in-up">{greet}</span>
                    <span className="block w-full truncate font-medium text-[1.5rem] tracking-tighter animate-fade-in-up">{userData?.name ? userData?.name.split(' ')[0] : userData?.username}</span>
                </div>
                <button className={`${helloSkyState ? "animate-fade-in-up" : "hidden"} animate-duration-400 hover:bg-white/20 active:bg-white/20 rounded-full p-1 transition duration-150`} ><img className="w-5" src="/assets/icons/cross.png" alt="cross" /></button>
            </div>

            {/* current temperature and icon */}
            <div className={`flex items-center justify-between animate-duration-400 px-1 ${helloSkyState ? "animate-fade-in-up" : "hidden"}`}>
                <div className="flex flex-col items-start gap-y-1">
                    <span className="text-4xl">{weatherInfo?.current?.temp_c != null ? `${weatherInfo.current.temp_c}°C` : "--"}</span>
                    <span className="text-xs tracking-normal w-full truncate">{weatherInfo?.location?.region}, {weatherInfo?.location?.name}</span>
                </div>
                {weatherInfo && <img src={weatherInfo?.current?.condition?.icon} alt="weath_icon" />}
            </div>
            
            {/* humidity, visibility, wind direction, wind speed */}
            <div className={`flex items-center justify-between mt-3 animate-duration-400 ${helloSkyState ? "animate-fade-in-up" : "hidden"}`}>   
                {/* humidity */}
                <div className="flex flex-col items-center gap-y-1">
                    <i className="fa-solid fa-droplet text-xl"></i>
                    <span className="text-sm font-light text-center tracking-wide">{weatherInfo?.current?.humidity + " %" || "--"}</span>
                </div>
            
                {/* visibility */}
                <div className="flex flex-col items-center gap-y-1">
                    <i className="fa-solid fa-eye text-xl"></i>
                    <span className="text-sm font-light text-center tracking-wide">{weatherInfo?.current?.vis_km + " km" || "--"}</span>
                </div>

                {/* wind direction */}
                <div className="flex flex-col items-center gap-y-1">
                    <i
                        className="fa-solid fa-location-arrow text-xl transition-transform -rotate-45"
                        style={{ transform: `rotate(${weatherInfo?.current?.wind_degree || 0}deg)` }}
                    ></i>
                    <span className="text-sm font-light text-center tracking-wide">{weatherInfo?.current?.wind_dir || "--"}</span>
                </div>

                {/* wind speed */}
                <div className="flex flex-col items-center gap-y-1">
                    <i className="fa-solid fa-wind text-xl"></i>
                    <span className="text-sm font-light text-center tracking-wide">{weatherInfo?.current?.wind_kph + " KPH" || "--"}</span>
                </div>

            </div>

            {/* AQI */}
            <div className={`text-sm text-left font-light tracking-tight mt-4 animate-duration-400 ${helloSkyState ? "animate-fade-in-up" : "hidden"}`}>Air Quality Index</div>

            {/* AQI */}
            <div className={`flex items-center justify-between mt-2 gap-y-1 px-1 animate-duration-400 ${helloSkyState ? "animate-fade-in-up" : "hidden"}`}>
                {/* CO */}
                <div className="flex flex-col items-center">
                    <p className="text-xl font-medium">CO</p>
                    <p className="text-xs text-center">{weatherInfo?.current?.air_quality?.co || "--"}</p>
                </div>
            
                {/* O3 */}
                <div className="flex flex-col items-center">
                    <p className="text-xl font-medium">O<sub>3</sub></p>
                    <p className="text-xs text-center">{weatherInfo?.current?.air_quality?.o3 || "--"}</p>
                </div>

                {/* PM2.5 */}
                <div className="flex flex-col items-center">
                    <p className="text-xl font-medium">PM2.5</p>
                    <p className="text-xs text-center">{weatherInfo?.current?.air_quality?.pm2_5 || "--"}</p>
                </div>

                {/* PM10 */}
                <div className="flex flex-col items-center">
                    <p className="text-xl font-medium">PM10</p>
                    <p className="text-xs text-center">{weatherInfo?.current?.air_quality?.pm10 || "--"}</p>
                </div>
            </div>
        
        </div>
    )
}

export default HelloSky;