import { FiSun } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../stores/Auth";
import { toggleTheme } from "../../contexts/slices/ThemeSlice";
import { useEffect } from "react";

const ThemeSwitcher = () => {
  const isDarkMode = useSelector(
    (state: RootState) => state.themeInfo.isDarkMode
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className="relative mt-1">
      <button>
        {isDarkMode ? (
          <FiSun
            size={28}
            className="text-white"
            onClick={() => dispatch(toggleTheme())}
          />
        ) : (
          <MdDarkMode
            size={28}
            onClick={() => dispatch(toggleTheme())}
            className="text-gray-800"
          />
        )}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
