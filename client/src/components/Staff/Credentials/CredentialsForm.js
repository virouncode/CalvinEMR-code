import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";

const CredentialsForm = () => {
  const navigate = useNavigate();
  const { auth, user, socket } = useAuth();
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
    try {
      const staff = await axiosXanoStaff.get("/staff", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      if (
        staff.data
          .filter(({ id }) => id !== user.id)
          .find(
            ({ email }) =>
              email.toLowerCase() === credentials.email.toLowerCase()
          )
      ) {
        setErrMsg(
          "There is already an account with this email, please choose another one"
        );
        return;
      }
    } catch (err) {
      setErrMsg(`Error: unable to change credentials: ${err.message}`);
      return;
    }

    try {
      //get staffInfo
      const me = (
        await axiosXanoStaff.get(`/staff/${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        })
      ).data;
      me.email = credentials.email.toLowerCase();
      me.password = credentials.password;
      await axiosXanoStaff.put(`/staff/${user.id}`, me, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      socket.emit("message", {
        route: "STAFF",
        action: "update",
        content: { id: user.id, data: me },
      });
      setSuccessMsg("Credentials changed succesfully");
      setTimeout(() => navigate("/login"), 2000);
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

export default CredentialsForm;
