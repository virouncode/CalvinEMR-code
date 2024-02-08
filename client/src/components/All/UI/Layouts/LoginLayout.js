import React from "react";
import { Outlet } from "react-router-dom";

const LoginLayout = () => {
  return (
    <div className="wrapper-login">
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
      </main>
    </div>
  );
};

export default LoginLayout;
