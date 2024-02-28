import React from "react";
import { Outlet } from "react-router-dom";
import useTitleContext from "../../../../hooks/useTitleContext";
import ConfirmGlobal from "../../Confirm/ConfirmGlobal";
import Welcome from "../../Welcome/Welcome";
import AdminHeader from "../Headers/AdminHeader";
import ToastCalvin from "../Toast/ToastCalvin";

const AdminLayout = () => {
  const { title } = useTitleContext();
  return (
    <div className="wrapper">
      <AdminHeader />
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

export default AdminLayout;
