import { useQueries } from "@tanstack/react-query";
import { useWeather } from "../contexts/WeatherContext";
import { useNavigate } from "react-router-dom";
import LoadingMini from "./LoadingMini";
import Swal from "sweetalert2";

const OPEN_WEATHER_KEY = "YOUR_OPENWEATHER_API_KEY";

function WeatherDisplay() {
  const { coordinates, setCoordinates, refreshTime, setRefreshTime } =
    useWeather();
  const navigate = useNavigate();

  async function fetchWeather({ lat, lon }) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return res.json();
  }

  const queries = useQueries({
    queries: coordinates?.map((coordinate) => ({
      queryKey: ["weather", coordinate.id],
      queryFn: () => fetchWeather(coordinate),
      refetchOnWindowFocus: false,
    })),
  });

  const weatherData = queries?.map(({ data, isLoading, error }, index) => ({
    data,
    isLoading,
    error,
    locationInfo: {
      displayName: coordinates[index].display_name,
      lat: coordinates[index].lat,
      lon: coordinates[index].lon,
      id: coordinates[index].id,
    },
  }));

  if (coordinates?.length === 0)
    return (
      <div className="h-screen items-center flex justify-center">
        <p className="text-xl text-stone-800 dark:text-slate-200 font-semibold">
          Add a location
        </p>
      </div>
    );

  return (
    <>
      <div className="flex items-center justify-end m-4 gap-2">
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700 text-xs"
          onClick={() => {
            Swal.fire({
              text: "Clear location(s)?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "No",
              confirmButtonColor: "#d33",
            }).then((result) => {
              if (result.isConfirmed) {
                setCoordinates([]);
                Swal.fire("Cleared!", "Locations has been cleared.", "success");
              }
            });
          }}
        >
          Clear
        </button>
        <select
          className="text-xs rounded dark:text-slate-200 text-stone-800 dark:bg-gray-700"
          value={refreshTime}
          onChange={(e) => setRefreshTime(e.target.value)}
        >
          <option value="">Refreshes after</option>
          <option value={300000}>5 minutes</option>
          <option value={600000}>10 minutes</option>
          <option value={900000}>15 minutes</option>
          <option value={1800000}>30 minutes</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4">
        {weatherData.map(({ data, isLoading, error, locationInfo }, index) => (
          <div
            key={index}
            className={`max-w-sm mx-auto rounded-lg overflow-hidden ${
              isLoading
                ? "bg-transparent h-64"
                : "bg-white  dark:bg-gray-800 shadow-md"
            }`}
          >
            {isLoading ? (
              <LoadingMini />
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                Error: {error.message}
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div className="h-64 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                      {locationInfo.displayName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {data.weather[0].description}
                    </p>
                  </div>
                  <img
                    src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
                    alt={data.weather[0].main}
                    className="w-16 h-16"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-4xl font-bold text-gray-800 dark:text-white">
                    {`${(data.main.temp - 273.15).toFixed(1)}°C`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Feels like: {(data.main.feels_like - 273.15).toFixed(1)}°C
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div>
                    <p className="text-xs">
                      Humidity:{" "}
                      <span className="font-semibold">
                        {data.main.humidity}%
                      </span>
                    </p>
                    <p className="text-xs">
                      Pressure:{" "}
                      <span className="font-semibold">
                        {data.main.pressure} hPa
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">
                      Wind:{" "}
                      <span className="font-semibold">
                        {data.wind.speed} m/s, {data.wind.deg}°
                      </span>
                    </p>
                    <p className="text-xs">
                      Visibility:{" "}
                      <span className="font-semibold">
                        {(data.visibility / 1000).toFixed(1)} km
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <div>
                    <p className="text-xs">
                      Sunrise:{" "}
                      <span className="font-semibold text-nowrap">
                        {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">
                      Sunset:{" "}
                      <span className="font-semibold text-nowrap">
                        {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700 text-xs"
                    onClick={() =>
                      navigate(
                        `/info?lat=${locationInfo.lat}&lon=${locationInfo.lon}&id=${locationInfo.id}`
                      )
                    }
                  >
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 text-xs"
                    onClick={() => {
                      Swal.fire({
                        text: "Delete Location?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        confirmButtonColor: "#d33",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setCoordinates((coordinates) =>
                            coordinates.filter(
                              (coordinate) => coordinate.id !== locationInfo.id
                            )
                          );
                          Swal.fire(
                            "Deleted!",
                            "Location has been deleted.",
                            "success"
                          );
                        }
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default WeatherDisplay;
