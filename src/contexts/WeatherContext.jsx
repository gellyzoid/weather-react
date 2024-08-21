import { createContext, useContext, useState } from "react";

const WeatherContext = createContext();

function WeatherProvider({ children }) {
  const [searchResult, setSearchResult] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [refreshTime, setRefreshTime] = useState(300000);
  const [isAdded, setIsAdded] = useState(false);
  const [coordinates, setCoordinates] = useState(
    function initializeLocalStorage() {
      const storedDisplay = localStorage.getItem("displayList");
      return storedDisplay ? JSON.parse(storedDisplay) : [];
    }
  );

  return (
    <WeatherContext.Provider
      value={{
        searchName,
        refreshTime,
        setSearchName,
        setRefreshTime,
        searchResult,
        setSearchResult,
        isAdded,
        setIsAdded,
        coordinates,
        setCoordinates,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

function useWeather() {
  const context = useContext(WeatherContext);

  return context;
}

export { WeatherProvider, useWeather };
