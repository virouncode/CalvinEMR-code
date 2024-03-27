import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";

const CredentialsFormAdmin = () => {
  const navigate = useNavigate();
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [credentials, setCredentials] = useState({
    email: auth.email,
    password: "",
    confirmPassword: "",
  });
  const [passwordValidity, setPasswordValidity] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    size: false,
  });
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    setCredentials({ ...credentials, [name]: value });
  };
  const handlePasswordChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    let newValidity = {};
    if (/[A-Z]/.test(value)) {
      newValidity.uppercase = true;
    } else {
      newValidity.uppercase = false;
    }
    if (/[a-z]/.test(value)) {
      newValidity.lowercase = true;
    } else {
      newValidity.lowercase = false;
    }
    if (/[0-9]/.test(value)) {
      newValidity.number = true;
    } else {
      newValidity.number = false;
    }
    if (/\W|_/.test(value)) {
      newValidity.special = true;
    } else {
      newValidity.special = false;
    }
    if (value.length >= 8 && value.length <= 16) {
      newValidity.size = true;
    } else {
      newValidity.size = false;
    }

    setPasswordValidity(newValidity);
    setCredentials({ ...credentials, password: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.confirmPassword !== credentials.password) {
      setErrMsg("Passwords do not match");
      return;
    }
    if (
      /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^\w\s]).{8,20}$/.test(
        credentials.password
      ) === false
    ) {
      setErrMsg("Invalid Password");
      return;
    }

    if (credentials.email.toLowerCase() !== auth.email.toLowerCase()) {
      try {
        const response = await xanoGet(`/admin_with_email`, "admin", {
          email: credentials.email.toLowerCase(),
        });
        if (response.data) {
          setErrMsg("There is already an account with this email");
          return;
        }
      } catch (err) {
        setErrMsg(`Error: unable to change credentials: ${err.message}`);
        return;
      }
    }

    try {
      //get my infos
      const me = (await xanoGet(`/admin/${user.id}`, "admin")).data;
      me.email = credentials.email.toLowerCase();
      me.password = credentials.password;
      const response = await xanoPut(`/admin/password/${user.id}`, "admin", me);
      socket.emit("message", {
        route: "ADMINS INFOS",
        action: "update",
        content: { id: user.id, data: response.data },
      });
      //pas besoin de socket sur USER car il va se relogger
      setSuccessMsg("Credentials changed succesfully");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setErrMsg(`Error: unable to change credentials: ${err.message}`);
      return;
    }
  };

  return successMsg ? (
    <p className="credentials-success">{successMsg}</p>
  ) : (
    <>
      <form className="credentials-form" onSubmit={handleSubmit}>
        <div className="credentials-form-row">
          <label htmlFor="email">New email</label>
          <input
            id="email"
            type="email"
            onChange={handleChange}
            name="email"
            value={credentials.email}
            autoComplete="off"
            required
          />
        </div>
        <div className="credentials-form-row">
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            onChange={handlePasswordChange}
            name="password"
            value={credentials.password}
            autoFocus
            autoComplete="off"
            required
          />
        </div>
        <div className="credentials-form-row">
          <ul>
            <li>
              {passwordValidity.size ? (
                <i
                  className="fa-solid fa-check"
                  style={{ color: "#0dbc01" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "#ff4d4d" }}
                ></i>
              )}{" "}
              <span
                style={{
                  color: passwordValidity.size ? "#0dbc01" : "#ff4d4d",
                }}
              >
                8-20 characters
              </span>
            </li>
            <li>
              {passwordValidity.uppercase ? (
                <i
                  className="fa-solid fa-check"
                  style={{ color: "#0dbc01" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "#ff4d4d" }}
                ></i>
              )}{" "}
              <span
                style={{
                  color: passwordValidity.uppercase ? "#0dbc01" : "#ff4d4d",
                }}
              >
                At least 1 uppercase letter
              </span>
            </li>
            <li>
              {passwordValidity.lowercase ? (
                <i
                  className="fa-solid fa-check"
                  style={{ color: "#0dbc01" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "#ff4d4d" }}
                ></i>
              )}{" "}
              <span
                style={{
                  color: passwordValidity.lowercase ? "#0dbc01" : "#ff4d4d",
                }}
              >
                At least 1 lowercase letter
              </span>
            </li>
            <li>
              {passwordValidity.number ? (
                <i
                  className="fa-solid fa-check"
                  style={{ color: "#0dbc01" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "#ff4d4d" }}
                ></i>
              )}{" "}
              <span
                style={{
                  color: passwordValidity.number ? "#0dbc01" : "#ff4d4d",
                }}
              >
                At least 1 number
              </span>
            </li>
            <li>
              {passwordValidity.special ? (
                <i
                  className="fa-solid fa-check"
                  style={{ color: "#0dbc01" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "#ff4d4d" }}
                ></i>
              )}{" "}
              <span
                style={{
                  color: passwordValidity.special ? "#0dbc01" : "#ff4d4d",
                }}
              >
                At least 1 special character
              </span>
            </li>
          </ul>
        </div>
        <div className="credentials-form-row">
          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            onChange={handleChange}
            name="confirmPassword"
            value={credentials.confirmPassword}
            autoComplete="off"
            required
          />
        </div>
        <div className="credentials-form-row-submit">
          <button type="submit">Submit</button>
        </div>
      </form>
      {errMsg && <div className="credentials-err">{errMsg}</div>}
    </>
  );
};

export default CredentialsFormAdmin;
