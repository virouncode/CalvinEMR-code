import React, { useState } from "react";
import DocMailboxFormSecretary from "./DocMailboxFormSecretary";

const DocMailboxSecretary = () => {
  const [errMsg, setErrMsg] = useState("");
  return (
    <>
      {errMsg && <p className="docmailbox__err">{errMsg}</p>}
      <h2 className="docmailbox__subtitle">Add a report</h2>
      <DocMailboxFormSecretary errMsg={errMsg} setErrMsg={setErrMsg} />
    </>
  );
};

export default DocMailboxSecretary;
