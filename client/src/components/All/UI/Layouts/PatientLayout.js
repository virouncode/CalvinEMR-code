import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal from "../../Confirm/ConfirmGlobal";
import Welcome from "../../Welcome/Welcome";
import PatientHeader from "../Headers/PatientHeader";

const PatientLayout = () => {
  return (
    <div className="wrapper">
      <PatientHeader />
      <Welcome />
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
        <ConfirmGlobal />
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
        />
      </main>
    </div>
  );
};

export default PatientLayout;
