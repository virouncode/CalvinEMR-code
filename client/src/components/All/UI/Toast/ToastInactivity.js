import React from "react";
import { ToastContainer } from "react-toastify";

const ToastInactivity = ({ id }) => {
  return (
    <ToastContainer
      enableMultiContainer
      containerId={id}
      position="top-right"
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      limit={1}
    />
  );
};

export default ToastInactivity;
