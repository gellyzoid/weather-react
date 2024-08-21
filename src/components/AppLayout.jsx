import { Flowbite } from "flowbite-react";
import Header from "./Header";
import Result from "./Result";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <Flowbite>
      <div className="flex flex-col min-h-screen dark:bg-gray-900">
        <Header />
        <Result />

        <main className="dark:bg-gray-900 min-h-screen">
          <Outlet />
        </main>

        <Footer />
      </div>
    </Flowbite>
  );
}

export default AppLayout;
