import React from "react";
import { Outlet } from "react-router-dom";
import useTitleContext from "../../../../hooks/useTitleContext";
import ConfirmGlobal from "../../Confirm/ConfirmGlobal";
import Welcome from "../../Welcome/Welcome";
import StaffHeader from "../Headers/StaffHeader";
import ToastAlarm from "../Toast/ToastAlarm";
import ToastCalvin from "../Toast/ToastCalvin";

const StaffLayout = () => {
  const { title } = useTitleContext();
  return (
    <div className="wrapper">
      <StaffHeader />
      <main>
        <Welcome title={title} />
        {/* all the children of the Layout component */}
        <Outlet />
        {/********************************************/}
        <ConfirmGlobal /> {/******* custom confirm modal ********/}
        <ToastCalvin id="A" />
        <ToastAlarm id="Z" />
        {/******* toast system *****************/}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default StaffLayout;
