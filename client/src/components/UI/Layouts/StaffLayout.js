import React from "react";
import { Outlet } from "react-router-dom";
import useTitleContext from "../../../hooks/context/useTitleContext";
import ConfirmGlobal from "../../All/Confirm/ConfirmGlobal";
import Welcome from "../../All/Welcome/Welcome";
import StaffHeader from "../Headers/StaffHeader";
import ToastCalvin from "../Toast/ToastCalvin";
import ToastInactivity from "../Toast/ToastInactivity";

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
        <ToastInactivity id="Z" />
        {/******* toast system *****************/}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default StaffLayout;
