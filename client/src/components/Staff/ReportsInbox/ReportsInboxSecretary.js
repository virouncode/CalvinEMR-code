import React, { useState } from "react";
import ReportsInboxFormSecretary from "./ReportsInboxFormSecretary";

const ReportsInboxSecretary = () => {
  const [errMsg, setErrMsg] = useState("");
  return (
    <>
      {errMsg && <p className="reportsinbox__err">{errMsg}</p>}
      <h2 className="reportsinbox__subtitle">Add a report</h2>
      <ReportsInboxFormSecretary errMsg={errMsg} setErrMsg={setErrMsg} />
    </>
  );
};

export default ReportsInboxSecretary;
