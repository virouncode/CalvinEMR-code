import React from "react";
import { ToastContainer } from "react-toastify";

const ToastAlarm = ({ id }) => {
  return (
    <ToastContainer
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
    />
  );
};

export default ToastAlarm;
