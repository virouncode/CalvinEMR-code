import { useContext } from "react";
import ClinicContext from "../../context/ClinicProvider";

const useClinicContext = () => {
  return useContext(ClinicContext);
};

export default useClinicContext;
