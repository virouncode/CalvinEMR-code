import React from "react";
import { Outlet } from "react-router-dom";
import useTitleContext from "../../../hooks/context/useTitleContext";
import ToastCalvin from "../../UI/Toast/ToastCalvin";
import ToastInactivity from "../../UI/Toast/ToastInactivity";
import ConfirmGlobal from "../Confirm/ConfirmGlobal";
import PatientHeader from "../Headers/PatientHeader";
import Welcome from "../Welcome/Welcome";

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
