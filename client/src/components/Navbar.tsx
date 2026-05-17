import { useState } from "react";

const Navbar = () => {
  const [dark, setDark] = useState(false);

  const toggleDarkMode = () => {
    setDark(!dark);

    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white p-4">
      <button
        onClick={toggleDarkMode}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
      >
        Toggle Dark Mode
      </button>
    </nav>
  );
};

export default Navbar;