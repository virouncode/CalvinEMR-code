import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal from "../../Confirm/ConfirmGlobal";
import Welcome from "../../Welcome/Welcome";
import StaffHeader from "../Headers/StaffHeader";

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
        <ToastContainer
          enableMultiContainer
          containerId={"A"}
          position="bottom-right"
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={1}
        />{" "}
        {/******* toast system *****************/}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default StaffLayout;
