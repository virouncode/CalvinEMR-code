import { createContext, useState } from "react";

const AdminsInfosContext = createContext({});

export const AdminsInfosProvider = ({ children }) => {
  const [adminsInfos, setAdminsInfos] = useState(
    localStorage.getItem("adminsInfos")
      ? JSON.parse(localStorage.getItem("adminsInfos"))
      : []
  );

  return (
    <AdminsInfosContext.Provider
      value={{
        adminsInfos,
        setAdminsInfos,
      }}
    >
      {children}
    </AdminsInfosContext.Provider>
  );
};

export default AdminsInfosContext;
