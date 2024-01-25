import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosXanoReset } from "../../../api/xanoReset";

const ResetPasswordForm = ({
  setErrMsg,
  setSuccesMsg,
  setResetOk,
  type,
  tempToken,
}) => {
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [passwordValidity, setPasswordValidity] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    size: false,
  });
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
    setPwd(value);
  };
  const navigate = useNavigate();
  const handleSubmitPwd = async (e) => {
    e.preventDefault();
    if (pwd !== confirmPwd) {
      setErrMsg("Passwords do not match");
      return;
    }
    if (
      /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^\w\s]).{8,20}$/.test(
        pwd
      ) === false
    ) {
      setErrMsg("Invalid Password");
      return;
    }
    try {
      await axiosXanoReset.post(
        `/auth/${type}/reset_password`,
        { password: pwd, confirm_password: confirmPwd },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );
      setSuccesMsg(
        "Your password has been reset successfully, we will redirect you to the login page"
      );
      setResetOk(true);
      setTimeout(() => navigate("/login"), 5000);
    } catch (err) {
      setErrMsg(`Unable to reset password: ${err.message}`);
    }
  };
  return (
    <form onSubmit={handleSubmitPwd} className="reset-password-form">
      <div className="reset-password-form-row">
        <label htmlFor="new-password">Enter a new password:</label>
        <input
          type="password"
          id="new-password"
          value={pwd}
          onChange={handlePasswordChange}
          required
          autoComplete="off"
        />
      </div>
      <div className="reset-password-form-row">
        <ul>
          <li>
            {passwordValidity.size ? (
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
      <div className="reset-password-form-row">
        <label htmlFor="confirm-password">Confirm new password:</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPwd}
          onChange={(e) => {
            setConfirmPwd(e.target.value);
            setErrMsg("");
          }}
          required
          autoComplete="off"
        />
      </div>
      <div className="reset-password-form-row-btn">
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
};

export default ResetPasswordForm;
