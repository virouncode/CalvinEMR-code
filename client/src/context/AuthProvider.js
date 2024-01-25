import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : {}
  );
  const [clinic, setClinic] = useState(
    localStorage.getItem("clinic")
      ? JSON.parse(localStorage.getItem("clinic"))
      : {}
  );
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
  );
  const [socket, setSocket] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        setUser,
        clinic,
        setClinic,
        socket,
        setSocket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
