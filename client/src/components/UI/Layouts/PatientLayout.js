import React from "react";
import { Outlet } from "react-router-dom";
import useTitleContext from "../../../hooks/context/useTitleContext";
import ConfirmGlobal from "../../All/Confirm/ConfirmGlobal";
import Welcome from "../../All/Welcome/Welcome";
import PatientHeader from "../Headers/PatientHeader";
import ToastCalvin from "../Toast/ToastCalvin";
import ToastInactivity from "../Toast/ToastInactivity";

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
        <ToastInactivity id="Z" />
      </main>
    </div>
  );
};

export default PatientLayout;
