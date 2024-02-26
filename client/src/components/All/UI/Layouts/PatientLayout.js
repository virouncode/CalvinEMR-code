import React from "react";
import { Outlet } from "react-router-dom";
import ConfirmGlobal from "../../Confirm/ConfirmGlobal";
import Welcome from "../../Welcome/Welcome";
import PatientHeader from "../Headers/PatientHeader";
import ToastCalvin from "../Toast/ToastCalvin";

const PatientLayout = () => {
  return (
    <div className="wrapper">
      <PatientHeader />
      <Welcome />
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
        <ConfirmGlobal />
        <ToastCalvin id="A" />
      </main>
    </div>
  );
};

export default PatientLayout;
