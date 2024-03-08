import React, { useState } from "react";

import xanoPost from "../../../api/xanoCRUD/xanoPost";

const TempPwdForm = ({
  emailInput,
  type,
  setValidTempPwd,
  setErrMsg,
  setTempToken,
}) => {
  const [tempPwd, setTempPwd] = useState("");
  const handleChange = (e) => {
    setErrMsg("");
    setTempPwd(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await xanoPost(`/auth/${type}/temp_login`, "reset", {
        email: emailInput,
        password: tempPwd,
      });
      setTempToken(response.data.tempToken);
      setValidTempPwd(true);
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit} className="temp-password-form">
      <p>
        Please enter the temporary password we have sent at (
        {emailInput.toLowerCase()}):
      </p>
      <div className="temp-password-form-row">
        <input
          type="password"
          name="tempPwd"
          onChange={handleChange}
          autoComplete="off"
          autoFocus
        />
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
};

export default TempPwdForm;
