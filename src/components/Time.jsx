import { useEffect, useState } from "react";

function Time() {
  const [time, setTime] = useState(new Date());

  useEffect(function () {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return function () {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col justify-start p-2 text-nowrap">
      <p className="text-slate-100 text-xs md:text-sm">
        {new Date().toLocaleDateString()}
      </p>
      <p className="text-slate-100 text-xs md:text-sm">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </p>
    </div>
  );
}

export default Time;
