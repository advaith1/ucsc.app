import { useEffect, useState } from "react";
import ToggleLightModeIcon from '/icons/toggle-light-mode.svg';
// import ToggleDarkModeIcon from '/icons/sun-light-mode.svg';
import ToggleDarkModeIcon from '/icons/toggle-dark-mode.svg';

// import SunIconLightMode from '/icons/sun-light-mode.svg';

import { Icon } from "./components/Icon";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <button
      onClick={toggle}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      <Icon
        svg={theme === "light" ? ToggleDarkModeIcon : ToggleLightModeIcon}
          data={""}
        // alt={theme === "light" ? "Switch to dark mode" : "Switch to light mode"} 
        // size={20} 
      />
      {/* Toggle {theme === "light" ? "Dark" : "Light"} Mode */}
    </button>
  );
}
