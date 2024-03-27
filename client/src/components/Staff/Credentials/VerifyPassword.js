import React, { useState } from "react";

import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useAuthContext from "../../../hooks/context/useAuthContext";

const VerifyPassword = ({ setVerified }) => {
  const LOGIN_URL = "/auth/login";
  const { auth } = useAuthContext();
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
      await xanoPost(LOGIN_URL, "staff", {
        email: auth.email,
        password,
      });
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

export default VerifyPassword;
