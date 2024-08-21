import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWeather } from "../contexts/WeatherContext";
import LoadingMini from "./LoadingMini";

function WeatherInfo() {
  const { coordinates } = useWeather();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [locationInfo, setLocationInfo] = useState([]);

  const navigate = useNavigate();

  const hasId = coordinates?.some(
    (coordinate) => coordinate.id === Number(searchParams.get("id"))
  );
  const displayName = coordinates?.filter(
    (coordinate) => coordinate.id === Number(searchParams.get("id"))
  );

  console.log(displayName);

  function getWeatherDetails(wmoCode) {
    const weatherMap = {
      0: {
        description: "Sunny",
        image: "http://openweathermap.org/img/wn/01d@2x.png",
      },
      1: {
        description: "Mainly Sunny",
        image: "http://openweathermap.org/img/wn/01d@2x.png",
      },
      2: {
        description: "Partly Cloudy",
        image: "http://openweathermap.org/img/wn/02d@2x.png",
      },
      3: {
        description: "Cloudy",
        image: "http://openweathermap.org/img/wn/03d@2x.png",
      },
      45: {
        description: "Foggy",
        image: "http://openweathermap.org/img/wn/50d@2x.png",
      },
      48: {
        description: "Rime Fog",
        image: "http://openweathermap.org/img/wn/50d@2x.png",
      },
      51: {
        description: "Light Drizzle",
        image: "http://openweathermap.org/img/wn/09d@2x.png",
      },
      53: {
        description: "Drizzle",
        image: "http://openweathermap.org/img/wn/09d@2x.png",
      },
      55: {
        description: "Heavy Drizzle",
        image: "http://openweathermap.org/img/wn/09d@2x.png",
      },
      56: {
        description: "Light Freezing Drizzle",
        image: "http://openweathermap.org/img/wn/09d@2x.png",
      },
      57: {
        description: "Freezing Drizzle",
        image: "http://openweathermap.org/img/wn/09d@2x.png",
      },
      61: {
        description: "Light Rain",
        image: "http://openweathermap.org/img/wn/10d@2x.png",
      },
      63: {
        description: "Rain",
        image: "http://openweathermap.org/img/wn/10d@2x.png",
      },
      65: {
        description: "Heavy Rain",
        image: "http://openweathermap.org/img/wn/10d@2x.png",
      },
      66: {
        description: "Light Freezing Rain",
        image: "http://openweathermap.org/img/wn/10d@2x.png",
      },
      67: {
        description: "Freezing Rain",
        image: "http://openweathermap.org/img/wn/10d@2x.png",
      },
      71: {
        description: "Light Snow",
        image: "http://openweathermap.org/img/wn/13d@2x.png",
      },
      73: {
        description: "Snow",
        image: "http://openweathermap.org/img/wn/13d@2x.png",
      },
      75: {
        description: "Heavy Snow",
        image: "http://openweathermap.org/img/wn/13d@2x.png",
      },
      77: {
        description: "Snow Grains",
        image: "http://openweathermap.org/img/wn/13d@2x.png",
      },
      80: {
        description: "Light Showers",
        image: "http://openweathermap.org/img/wn/09d@2x.png",
      },
      81: {
        description: "Showers",
        image: "http://openweathermap.org/img/wn/09d@2x.png",
      },
      82: {
        description: "Heavy Showers",
        image: "http://openweathermap.org/img/wn/09d@2x.png",
      },
      85: {
        description: "Light Snow Showers",
        image: "http://openweathermap.org/img/wn/13d@2x.png",
      },
      86: {
        description: "Snow Showers",
        image: "http://openweathermap.org/img/wn/13d@2x.png",
      },
      95: {
        description: "Thunderstorm",
        image: "http://openweathermap.org/img/wn/11d@2x.png",
      },
      96: {
        description: "Light Thunderstorms With Hail",
        image: "http://openweathermap.org/img/wn/11d@2x.png",
      },
      99: {
        description: "Thunderstorm With Hail",
        image: "http://openweathermap.org/img/wn/11d@2x.png",
      },
    };

    return weatherMap[wmoCode] || { description: "Unknown", image: "" };
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchLocation() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${searchParams.get(
            "lat"
          )}&longitude=${searchParams.get(
            "lon"
          )}&daily=weather_code,temperature_2m_max,temperature_2m_min`,
          { signal }
        );
        const data = await res.json();
        setLocationInfo(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setError("Failed to fetch data");
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (hasId) fetchLocation();

    return () => {
      controller.abort();
    };
  }, [searchParams, hasId]);

  if (isLoading) return <LoadingMini />;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <button
        className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700 mb-2 text-xs"
        onClick={() => navigate("/")}
      >
        &larr; Back
      </button>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {displayName?.at(0).display_name}
      </h1>
      <h1 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
        7-Day Forecast
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {locationInfo?.daily?.time?.map((date, index) => {
          const { description, image } = getWeatherDetails(
            locationInfo?.daily.weather_code[index]
          );

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                })}
              </p>

              <div className="flex items-center justify-between mt-4">
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {`${locationInfo?.daily.temperature_2m_max[index]}°C`}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Min: {`${locationInfo?.daily.temperature_2m_min[index]}°C`}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <img src={image} alt={description} className="w-12 h-12" />
                <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherInfo;
