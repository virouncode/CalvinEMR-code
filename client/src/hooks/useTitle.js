import { useEffect } from "react";
import useTitleContext from "./useTitleContext";

const useTitle = (text) => {
  const { setTitle } = useTitleContext();
  useEffect(() => {
    setTitle(text);
  }, [setTitle, text]);
};

export default useTitle;
