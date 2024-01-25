import { useEffect } from "react";

// Custom hook for managing localStorage and detecting tab closures
export const useLocalStorageTracker = () => {
  useEffect(() => {
    const handleTabClosing = () => {
      if (localStorage.getItem("tabCounter") === null) return;
      if (localStorage.getItem("tabCounter") === "1") {
        localStorage.clear();
      } else {
        localStorage.setItem(
          "tabCounter",
          (parseInt(localStorage.getItem("tabCounter")) - 1).toString()
        );
      }
    };

    if (localStorage.getItem("tabCounter") === null) {
      localStorage.setItem("tabCounter", "1");
    } else {
      localStorage.setItem(
        "tabCounter",
        (parseInt(localStorage.getItem("tabCounter")) + 1).toString()
      );
    }

    window.addEventListener("beforeunload", handleTabClosing);
    return () => {
      window.removeEventListener("beforeunload", handleTabClosing);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useLocalStorageTracker;
