import React, { useState } from "react";
import { axiosXanoReset } from "../../../api/xanoReset";

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
      const response = await axiosXanoReset.post(`/auth/${type}/temp_login`, {
        email: emailInput,
        password: tempPwd,
      });
      setTempToken(response.data);
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
