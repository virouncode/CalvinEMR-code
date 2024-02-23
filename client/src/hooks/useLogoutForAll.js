import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "./useAuthContext";
import useStaffInfosContext from "./useStaffInfosContext";
import useUserContext from "./useUserContext";

const useLogoutForAll = () => {
  const { setUser } = useUserContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    const storageListener = (e) => {
      if (e.key !== "message") return;
      const message = e.newValue;
      if (!message) return;
      if (message === "logout") {
        setUser({});
        setStaffInfos([]);
        setAuth({});
        navigate("/");
      }
    };
    window.addEventListener("storage", storageListener);
    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, [navigate, setAuth, setStaffInfos, setUser]);
};

export default useLogoutForAll;
