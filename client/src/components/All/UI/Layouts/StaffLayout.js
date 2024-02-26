import React from "react";
import { Outlet } from "react-router-dom";
import ConfirmGlobal from "../../Confirm/ConfirmGlobal";
import Welcome from "../../Welcome/Welcome";
import StaffHeader from "../Headers/StaffHeader";
import ToastCalvin from "../Toast/ToastCalvin";

const StaffLayout = () => {
  return (
    <div className="wrapper">
      <StaffHeader />
      <main>
        <Welcome />
        {/* all the children of the Layout component */}
        <Outlet />
        {/********************************************/}
        <ConfirmGlobal /> {/******* custom confirm modal ********/}
        <ToastCalvin id="A" />
        {/******* toast system *****************/}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default StaffLayout;
