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
  const handleClickReference = () => {
    const docWindow = window.open(
      "https://www.canada.ca/en/public-health/services/publications/healthy-living/canadian-immunization-guide-part-1-key-immunization-information/page-13-recommended-immunization-schedules.html",
      "_blank",
      `resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=1000, left=0, top=0`
    );
    if (docWindow === null) {
      alert("Please disable your browser pop-up blocker and sign in again");
      window.location.assign("/login");
      return;
    }
  };

  return (
    <>
      <h1 className="immunizations__title">
        Patient immunizations <i className="fa-solid fa-syringe"></i>
        <button onClick={handleClose}>Close</button>
      </h1>
      {isLoading ? (
        <CircularProgress size="1rem" style={{ margin: "5px" }} />
      ) : errMsg ? (
        <p className="immunizations__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <h2 className="immunizations__subtitle">
              Recommended{" "}
              <span
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "blue",
                  marginLeft: "10px",
                  fontWeight: "normal",
                }}
                onClick={handleClickReference}
              >
                (Reference)
              </span>
            </h2>
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
