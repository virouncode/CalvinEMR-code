import { useEffect, useRef } from "react";
import useAuthContext from "./useAuthContext";
import useStaffInfosContext from "./useStaffInfosContext";
import useUserContext from "./useUserContext";

const useAutoLogout = (timeMin) => {
  const { setAuth } = useAuthContext();
  const { setUser } = useUserContext();
  const { setStaffInfos } = useStaffInfosContext();
  const logout = () => {
    setAuth({});
    setUser({});
    setStaffInfos([]);
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("tabCounter");
    localStorage.removeItem("lastAction");
    localStorage.setItem("message", "logout");
    localStorage.removeItem("message");
  };
  let timerID = useRef(null);

  const startTimer = () => {
    timerID.current = window.setTimeout(logout, timeMin * 60 * 1000);
  };
  const stopTimer = () => {
    window.clearTimeout(timerID.current);
  };
  const resetTimer = () => {
    stopTimer();
    startTimer();
    localStorage.setItem("lastAction", Date.now());
  };
  const resetTimeout = () => {
    window.addEventListener("mousemove", resetTimer, false);
    window.addEventListener("mousedown", resetTimer, false);
    window.addEventListener("keypress", resetTimer, false);
    window.addEventListener("DOMMouseScroll", resetTimer, false);
    window.addEventListener("mousewheel", resetTimer, false);
    window.addEventListener("touchmove", resetTimer, false);
    window.addEventListener("MSPointerMove", resetTimer, false);
  };

  const handleStorageEvent = (e) => {
    if (e.key === "lastAction") {
      resetTimeout();
      startTimer();
    }
  };

  useEffect(() => {
    resetTimeout();
    startTimer();
    localStorage.setItem("lastAction", Date.now());
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      stopTimer();
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);
};

export default useAutoLogout;
