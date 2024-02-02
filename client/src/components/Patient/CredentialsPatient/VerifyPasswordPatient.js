import React, { useState } from "react";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import useAuth from "../../../hooks/useAuth";

const VerifyPasswordPatient = ({ setVerified }) => {
  const LOGIN_URL = "/auth/login";
  const { auth } = useAuth();
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const handleChange = (e) => {
    setErrMsg("");
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //=============== AUTH =================//
      await axiosXanoPatient.post(
        LOGIN_URL,
        JSON.stringify({ email: auth.email, password }),
        {
          "Content-Type": "application/json",
          headers: { "Content-Type": "application/json" },
        }
      );
      setVerified(true);
    } catch (err) {
      setVerified(false);
      setErrMsg("Invalid Password");
    }
  };
  return (
    <div className="verify-pwd">
      <div className="verify-pwd-title">Please enter your password</div>
      <form className="verify-pwd-form" onSubmit={handleSubmit}>
        <label htmlFor="pwd">Password</label>
        <input
          type="password"
          value={password}
          id="pwd"
          onChange={handleChange}
          autoFocus
        />
        <button type="submit">Ok</button>
      </form>
      {errMsg && <div className="verify-pwd-err">{errMsg}</div>}
    </div>
  );
};

export default VerifyPasswordPatient;
