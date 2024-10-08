import { WeatherProvider } from "./contexts/WeatherContext";
import Main from "./components/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WeatherInfo from "./components/WeatherInfo";
import WeatherDisplay from "./components/WeatherDisplay";
import NotFound from "./components/NotFound";

function App() {
  return (
    <WeatherProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Main />}>
            <Route index element={<WeatherDisplay />} replace to="/" />
            <Route path="info" element={<WeatherInfo />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
