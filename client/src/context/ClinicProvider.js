import { createContext, useState } from "react";

const ClinicContext = createContext({});

export const ClinicProvider = ({ children }) => {
  const [clinic, setClinic] = useState(
    localStorage.getItem("clinic")
      ? JSON.parse(localStorage.getItem("clinic"))
      : {}
  );

  return (
    <ClinicContext.Provider
      value={{
        clinic,
        setClinic,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export default ClinicContext;
