import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { SocketProvider } from "./context/SocketProvider";
import { StaffInfosProvider } from "./context/StaffInfosProvider";
import { UserProvider } from "./context/UserProvider";
import "./styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <SocketProvider>
          <StaffInfosProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </StaffInfosProvider>
        </SocketProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
