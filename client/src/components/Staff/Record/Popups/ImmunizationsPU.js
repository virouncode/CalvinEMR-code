import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal from "../../../All/Confirm/ConfirmGlobal";
import ImmunizationsCaption from "../Topics/Immunizations/ImmunizationsCaption";
import ImmunizationsTable from "../Topics/Immunizations/ImmunizationsTable";
import RecImmunizationsTable from "../Topics/Immunizations/RecImmunizationsTable";

const ImmunizationsPU = ({
  datas,
  isLoading,
  errMsg,
  setPopUpVisible,
  demographicsInfos,
  patientId,
}) => {
  const [errMsgPost, setErrMsgPost] = useState("");
  const handleClose = () => {
    setPopUpVisible(false);
  };

  return (
    <>
      <h1 className="immunizations__title">
        Patient immunizations <i className="fa-solid fa-syringe"></i>
        <button onClick={handleClose}>Close</button>
      </h1>
      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="immunizations__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <h2 className="immunizations__subtitle">Recommended</h2>
            <RecImmunizationsTable
              demographicsInfos={demographicsInfos}
              datas={datas.filter(({ recommended }) => recommended === true)}
              patientId={patientId}
            />
            <ImmunizationsCaption />
            <h2 className="immunizations__subtitle">Others</h2>
            {errMsgPost && <p className="immunizations__err">{errMsgPost}</p>}
            <ImmunizationsTable
              demographicsInfos={demographicsInfos}
              datas={datas.filter(({ recommended }) => recommended === false)}
              setErrMsgPost={setErrMsgPost}
              errMsgPost={errMsgPost}
              patientId={patientId}
            />
          </>
        )
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </>
  );
};

export default ImmunizationsPU;
