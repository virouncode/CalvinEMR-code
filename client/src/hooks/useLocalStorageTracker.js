import { useCallback, useEffect } from "react";
export const useLocalStorageTracker = () => {
  const handleTabClosing = useCallback(() => {
    if (localStorage.getItem("tabCounter") === "1") {
      localStorage.clear(); //remove if we want to be able to refresh or type a URL without signing in again (but it keeps the user idefinitely connected even if he closes and comes back)
      // localStorage.removeItem("tabCounter");
    } else {
      localStorage.setItem(
        "tabCounter",
        (parseInt(localStorage.getItem("tabCounter")) - 1).toString() //else remove 1
      );
    }
  }, []);

  useEffect(() => {
    if (
      !localStorage.getItem("tabCounter") ||
      isNaN(localStorage.getItem("tabCounter"))
    ) {
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
  }, [handleTabClosing]);
};

export default useLocalStorageTracker;
