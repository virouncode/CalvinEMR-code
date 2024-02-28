import React from "react";
import { Outlet } from "react-router-dom";
import useTitleContext from "../../../../hooks/useTitleContext";
import ConfirmGlobal from "../../Confirm/ConfirmGlobal";
import Welcome from "../../Welcome/Welcome";
import PatientHeader from "../Headers/PatientHeader";
import ToastCalvin from "../Toast/ToastCalvin";

const PatientLayout = () => {
  const { title } = useTitleContext();
  return (
    <div className="wrapper">
      <PatientHeader />
      <Welcome title={title} />
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
