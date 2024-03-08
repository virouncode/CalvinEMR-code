/*Custom hook to automatically logout after a certain time of inactivity
We start a timer in each tab
We listen to the activity in each
when there is activity in one tab :
1) we reset the timer in this tab
2) we set lastAction key in localStorage (with Date.now() for instance)
3) every tabs listen to lastAction key in localStorage
4) when they receive lastAction key event they reset their timer */
import { useCallback, useEffect, useRef } from "react";
import useAdminsInfosContext from "./useAdminsInfosContext";
import useAuthContext from "./useAuthContext";
import useStaffInfosContext from "./useStaffInfosContext";
import useUserContext from "./useUserContext";

const useAutoLogout = (timeMin) => {
  const { setAuth } = useAuthContext();
  const { setUser } = useUserContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  let timerID = useRef(null);

  const logout = useCallback(() => {
    setAuth({});
    setUser({});
    setStaffInfos([]);
    setAdminsInfos([]);
    localStorage.setItem("message", "logout"); //send a message to all tabs to logout
    localStorage.clear(); //then clear local storage
  }, [setAdminsInfos, setAuth, setStaffInfos, setUser]);

  const startTimer = useCallback(() => {
    timerID.current = window.setTimeout(logout, timeMin * 60 * 1000);
  }, [logout, timeMin]);

  const stopTimer = useCallback(() => {
    window.clearTimeout(timerID.current);
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    startTimer();
    localStorage.setItem("lastAction", Date.now());
  }, [startTimer, stopTimer]);

  const handleStorageEvent = useCallback(
    (e) => {
      if (e.key === "lastAction") {
        resetTimer();
      }
    },
    [resetTimer]
  );

  useEffect(() => {
    startTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("DOMMouseScroll", resetTimer);
    window.addEventListener("mousewheel", resetTimer);
    window.addEventListener("touchmove", resetTimer);
    window.addEventListener("MSPointerMove", resetTimer);
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      stopTimer();
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("DOMMouseScroll", resetTimer);
      window.removeEventListener("mousewheel", resetTimer);
      window.removeEventListener("touchmove", resetTimer);
      window.removeEventListener("MSPointerMove", resetTimer);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [handleStorageEvent, resetTimer, startTimer, stopTimer]);
};

export default useAutoLogout;
