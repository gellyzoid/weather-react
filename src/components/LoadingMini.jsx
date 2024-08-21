import { Spinner } from "flowbite-react";

function LoadingMini() {
  return (
    <div className="flex items-center justify-center overflow-hidden">
      <Spinner className="h-12 w-12" />
    </div>
  );
}

export default LoadingMini;
