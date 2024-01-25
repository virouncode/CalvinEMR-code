import React, { useState } from "react";
import EmailForm from "./EmailForm";
import ResetPasswordForm from "./ResetPasswordForm";
import TempPwdForm from "./TempPwdForm";

const ForgotPassword = () => {
  const [emailInput, setEmailInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [validTempPwd, setValidTempPwd] = useState(false);
  const [type, setType] = useState("staff");
  const [requestSent, setRequestSent] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [resetOk, setResetOk] = useState(false);

  return (
    <div className="reset-container">
      {validTempPwd ? (
        <h2 className="reset-container-title">Reset Password</h2>
      ) : requestSent ? (
        <h2 className="reset-container-title">Temporary Password</h2>
      ) : (
        <h2 className="reset-container-title">Email Verification</h2>
      )}
      {successMsg && <p className="reset-container-success">{successMsg}</p>}
      {errMsg && <p className="reset-container-err">{errMsg}</p>}
      {!requestSent && !validTempPwd && (
        <EmailForm
          setRequestSent={setRequestSent}
          setErrMsg={setErrMsg}
          type={type}
          setType={setType}
          emailInput={emailInput}
          setEmailInput={setEmailInput}
        />
      )}
      {requestSent && !validTempPwd && (
        <TempPwdForm
          emailInput={emailInput}
          setValidTempPwd={setValidTempPwd}
          setErrMsg={setErrMsg}
          setTempToken={setTempToken}
          type={type}
        />
      )}
      {validTempPwd && !resetOk && (
        <ResetPasswordForm
          setErrMsg={setErrMsg}
          tempToken={tempToken}
          type={type}
          setSuccesMsg={setSuccessMsg}
          setResetOk={setResetOk}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
