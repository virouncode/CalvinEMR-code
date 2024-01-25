import React, { useState } from "react";
import DocMailboxFormSecretary from "./DocMailboxFormSecretary";

const DocMailboxSecretary = () => {
  const [errMsg, setErrMsg] = useState("");
  return (
    <>
      {errMsg && <p className="docmailbox__err">{errMsg}</p>}
      <p className="docmailbox__instructions">
        Add a document to a practician’s inbox
      </p>
      <DocMailboxFormSecretary errMsg={errMsg} setErrMsg={setErrMsg} />
    </>
  );
};

export default DocMailboxSecretary;
