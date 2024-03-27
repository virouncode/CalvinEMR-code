import { useContext } from "react";
import TitleContext from "../../context/TitleProvider";

const useTitleContext = () => {
  return useContext(TitleContext);
};

export default useTitleContext;
