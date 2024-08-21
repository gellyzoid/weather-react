import { useEffect, useState } from "react";
import { useWeather } from "../contexts/WeatherContext";
import Loading from "./Loading";
import Swal from "sweetalert2";

function Result() {
  const {
    searchName,
    setSearchName,
    searchResult,
    setSearchResult,
    isAdded,
    setIsAdded,
    setCoordinates,
    coordinates,
  } = useWeather();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchLocation() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${searchName}`,
          { signal }
        );
        const data = await res.json();

        if (data.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Location not found!",
          });
          setIsAdded(false);
        } else {
          setSearchResult(data);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setError("Failed to fetch data");
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (searchName) {
      fetchLocation();
    }

    return () => {
      controller.abort();
    };
  }, [searchName, setSearchResult]);

  useEffect(
    function () {
      localStorage.setItem("displayList", JSON.stringify(coordinates));
    },
    [coordinates]
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    isAdded && (
      <div className="px-4 py-3 border-b dark:border-gray-700">
        {searchResult.length !== 0 && (
          <p className="text-stone-800 dark:text-slate-200">
            {searchResult.length} Search result
            {searchResult.length !== 1 && "s"}
          </p>
        )}

        <div className="flex flex-col items-center">
          {searchResult.map((result) => (
            <ul
              className="mt-2 divide-y divide-stone-200 border-t dark:border-gray-700 text-sm w-full text-stone-800 dark:text-slate-200"
              key={result.place_id}
            >
              <li className="py-3 flex items-center justify-between">
                <p className="mb-1">{result.display_name}</p>
                <button
                  className="ml-2 rounded-md bg-yellow-500 hover:bg-yellow-600 p-2 text-sm transition-all duration-300 text-white disabled:cursor-not-allowed text-xs"
                  onClick={() => {
                    setSearchName("");
                    setCoordinates((coordinates) => {
                      const alreadyExists = coordinates.some(
                        (coordinate) =>
                          coordinate.lat === result.lat &&
                          coordinate.lon === result.lon
                      );

                      if (!alreadyExists) {
                        setIsAdded(false);
                        return [
                          ...coordinates,
                          {
                            lat: result.lat,
                            lon: result.lon,
                            display_name: result.display_name,
                            id: result.osm_id,
                          },
                        ];
                      }

                      return coordinates;
                    });
                  }}
                >
                  Add
                </button>
              </li>
            </ul>
          ))}

          {searchResult.length !== 0 && (
            <div className="flex w-full items-center justify-end">
              <button
                className="mt-2 rounded-md bg-red-500 hover:bg-red-600 p-2 text-sm transition-all duration-300 text-white disabled:cursor-not-allowed text-xs"
                onClick={() => {
                  setSearchResult([]);
                  setSearchName("");
                  setIsAdded(false);
                }}
              >
                Clear
              </button>{" "}
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default Result;
