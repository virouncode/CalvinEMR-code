import { useEffect } from "react";
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
  useEffect(() => {
    const storageListener = (e) => {
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
    };
    window.addEventListener("storage", storageListener);
    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, [navigate, setAuth, setStaffInfos, setAdminsInfos, setUser]);
};

export default useLogoutForAll;
