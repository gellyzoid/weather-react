import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWeather } from "../contexts/WeatherContext";
import AppLayout from "./AppLayout";

function Main() {
  const { refreshTime } = useWeather();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: refreshTime,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout />
    </QueryClientProvider>
  );
}

export default Main;
