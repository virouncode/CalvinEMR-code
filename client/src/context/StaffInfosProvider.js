import { createContext, useState } from "react";

const StaffInfosContext = createContext({});

export const StaffInfosProvider = ({ children }) => {
  const [staffInfos, setStaffInfos] = useState(
    localStorage.getItem("staffInfos")
      ? JSON.parse(localStorage.getItem("staffInfos"))
      : []
  );

  return (
    <StaffInfosContext.Provider
      value={{
        staffInfos,
        setStaffInfos,
      }}
    >
      {children}
    </StaffInfosContext.Provider>
  );
};

export default StaffInfosContext;
