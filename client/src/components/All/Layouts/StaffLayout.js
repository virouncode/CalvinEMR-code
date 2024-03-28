import React from "react";
import { Outlet } from "react-router-dom";
import useTitleContext from "../../../hooks/context/useTitleContext";
import ToastCalvin from "../../UI/Toast/ToastCalvin";
import ToastInactivity from "../../UI/Toast/ToastInactivity";
import ConfirmGlobal from "../Confirm/ConfirmGlobal";
import StaffHeader from "../Headers/StaffHeader";
import Welcome from "../Welcome/Welcome";

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
