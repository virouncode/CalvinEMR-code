import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { nowTZTimestamp } from "../utils/dates/formatDates";
import useAdminsInfosContext from "./context/useAdminsInfosContext";
import useAuthContext from "./context/useAuthContext";
import useClinicContext from "./context/useClinicContext";
import useStaffInfosContext from "./context/useStaffInfosContext";
import useUserContext from "./context/useUserContext";

const useAutoLogout = (timeMin) => {
  const { setUser } = useUserContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAuth } = useAuthContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setClinic } = useClinicContext();
  const navigate = useNavigate();
  let logoutTimerID = useRef(null);
  let toastTimerID = useRef(null);
  const toastID = useRef(null);
  const timeLeft = useRef(timeMin * 60);

  const logout = useCallback(() => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("staffInfos");
    localStorage.removeItem("clinic");
    localStorage.removeItem("lastAction");
    localStorage.removeItem("adminsInfos");
    localStorage.removeItem("currentClinicalNote");
    localStorage.setItem("message", "logout"); //send a message to all tabs to logout
    localStorage.removeItem("message");
    toastID.current && toast.dismiss(toastID.current);
    timeLeft.current = timeMin * 60;
    setUser({});
    setAuth({});
    setStaffInfos([]);
    setAdminsInfos([]);
    setClinic({});
    navigate("/");
  }, [
    navigate,
    setAdminsInfos,
    setAuth,
    setClinic,
    setStaffInfos,
    setUser,
    timeMin,
  ]);

  const startTimer = useCallback(() => {
    logoutTimerID.current = window.setTimeout(logout, timeMin * 60 * 1000);
    toastTimerID.current = window.setInterval(() => {
      timeLeft.current -= 1;
      if (timeLeft.current === 60) {
        toastID.current = toast.info(
          `Due to inactivity, you will be disconnected in 60 s`,
          { containerId: "Z" }
        );
      } else if (timeLeft.current < 60 && toastID.current) {
        const message = `Due to inactivity, you will be disconnected in ${timeLeft.current} s`;
        toast.update(toastID.current, {
          containerId: "Z",
          render: message,
          type: toast.TYPE.INFO,
          progress: timeLeft.current / 60,
        });
      }
    }, 1000);
  }, [logout, timeLeft, timeMin]);

  const stopTimer = useCallback(() => {
    window.clearTimeout(logoutTimerID.current);
    window.clearInterval(toastTimerID.current);
    logoutTimerID.current = null;
    toastTimerID.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    timeLeft.current = timeMin * 60;
    toastID.current && toast.dismiss(toastID.current);
    startTimer();
    localStorage.setItem("lastAction", nowTZTimestamp());
  }, [startTimer, stopTimer, timeMin]);

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
    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("DOMMouseScroll", resetTimer);
    window.addEventListener("mousewheel", resetTimer);
    window.addEventListener("touchmove", resetTimer);
    window.addEventListener("MSPointerMove", resetTimer);
    return () => {
      stopTimer();
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("DOMMouseScroll", resetTimer);
      window.removeEventListener("mousewheel", resetTimer);
      window.removeEventListener("touchmove", resetTimer);
      window.removeEventListener("MSPointerMove", resetTimer);
    };
  }, [handleStorageEvent, resetTimer, startTimer, stopTimer]);
};

export default useAutoLogout;
