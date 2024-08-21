import { useState } from "react";
import { useWeather } from "../contexts/WeatherContext";

function Searchbar() {
  const { setSearchName, setIsAdded } = useWeather();
  const [currentSearch, setCurrentSearch] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setSearchName(currentSearch);
    setCurrentSearch("");
    setIsAdded(true);
  }

  return (
    <form onSubmit={handleSubmit} className="p-2 w-full max-w-xs">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Search location..."
          required=""
          value={currentSearch}
          onChange={(e) => setCurrentSearch(e.target.value)}
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default Searchbar;
