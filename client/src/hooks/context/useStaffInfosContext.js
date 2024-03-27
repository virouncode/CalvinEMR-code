import { useContext } from "react";
import StaffInfosContext from "../../context/StaffInfosProvider";

const useStaffInfosContext = () => {
  return useContext(StaffInfosContext);
};

export default useStaffInfosContext;
