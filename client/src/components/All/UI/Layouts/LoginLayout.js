import React from "react";
import { Outlet } from "react-router-dom";

const LoginLayout = () => {
  return (
    <div className="wrapper">
      {/* <LoginHeader /> */}
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default LoginLayout;
