import { useContext } from "react";
import AdminsInfosContext from "../../context/AdminsInfosProvider";

const useAdminsInfosContext = () => {
  return useContext(AdminsInfosContext);
};

export default useAdminsInfosContext;
