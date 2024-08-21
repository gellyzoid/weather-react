import { DarkThemeToggle } from "flowbite-react";
import Searchbar from "./Searchbar";
import Time from "./Time";

function Header() {
  return (
    <header className="flex items-center justify-between bg-purple-600">
      <Searchbar />
      <div className="flex items-center">
        <Time />
        <DarkThemeToggle className="text-white dark:text-gray-300 bg-purple-400 p-2 mr-2 rounded" />
      </div>
    </header>
  );
}

export default Header;
