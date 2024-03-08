//If one tab logs out, logout all the tables
//Listen to local storage events, if the key is "message" and the valu is "logout" => logout
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdminsInfosContext from "./useAdminsInfosContext";
import useAuthContext from "./useAuthContext";
import useStaffInfosContext from "./useStaffInfosContext";
import useUserContext from "./useUserContext";

const useLogoutForAll = () => {
  const { setUser } = useUserContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAuth } = useAuthContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const navigate = useNavigate();
  const handleStorageEvent = useCallback(
    (e) => {
      if (e.key !== "message") return;
      const message = e.newValue;
      if (!message) return;
      if (message === "logout") {
        setUser({});
        setStaffInfos([]);
        setAuth({});
        setAdminsInfos([]);
        navigate("/");
      }
    },
    [navigate, setAdminsInfos, setAuth, setStaffInfos, setUser]
  );
  useEffect(() => {
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [handleStorageEvent]);
};

export default useLogoutForAll;
