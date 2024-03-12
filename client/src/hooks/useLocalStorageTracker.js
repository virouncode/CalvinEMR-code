//All the tabs must know how many of them are open => local storage tabCounter
//When i close a tab i decrement tabCounter or i clear localStorage if it's the last remaining tab
//when landing on App i increment tabCounter or i create it and set it to 1 if it doesn't exists
import { useCallback, useEffect } from "react";
export const useLocalStorageTracker = () => {
  const handleTabClosing = useCallback(() => {
    if (localStorage.getItem("tabCounter") === "1") {
      localStorage.clear();
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
