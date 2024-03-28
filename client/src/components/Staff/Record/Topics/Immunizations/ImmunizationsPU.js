import React, { useRef, useState } from "react";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../../All/Confirm/ConfirmGlobal";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import ToastCalvin from "../../../../UI/Toast/ToastCalvin";
import ImmunizationsCaption from "./ImmunizationsCaption";
import ImmunizationsTable from "./ImmunizationsTable";
import RecImmunizationsTable from "./RecImmunizationsTable";

const ImmunizationsPU = ({
  topicDatas,
  loading,
  errMsg,
  patientId,
  setPopUpVisible,
  patientDob,
  loadingPatient,
  errPatient,
}) => {
  //HOOKS
  const [errMsgPost, setErrMsgPost] = useState("");
  const editCounter = useRef(0);

  //HANDLERS

  const handleClose = async (e) => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlert({
          content:
            "Do you really want to close the window ? Your changes will be lost",
        })))
    ) {
      setPopUpVisible(false);
    }
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
        Patient immunizations{" "}
        <i className="fa-solid fa-syringe" style={{ marginRight: "10px" }}></i>
        <button onClick={handleClose}>Close</button>
      </h1>
      {errMsg && <div className="immunizations__err">{errMsg}</div>}
      {loading && <LoadingParagraph />}
      {!errMsg && (
        <>
          <h2 className="immunizations__subtitle">
            Recommended{" "}
            <span
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "blue",
                marginLeft: "5px",
                fontWeight: "normal",
              }}
              onClick={handleClickReference}
            >
              (Reference)
            </span>
          </h2>
          <RecImmunizationsTable
            patientDob={patientDob}
            datas={topicDatas.filter(({ recommended }) => recommended)}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
          <ImmunizationsCaption />
          <h2 className="immunizations__subtitle">Others</h2>
          {errMsgPost && <p className="immunizations__err">{errMsgPost}</p>}
          <ImmunizationsTable
            datas={topicDatas.filter(({ recommended }) => !recommended)}
            setErrMsgPost={setErrMsgPost}
            errMsgPost={errMsgPost}
            patientId={patientId}
            editCounter={editCounter}
          />
        </>
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default ImmunizationsPU;
