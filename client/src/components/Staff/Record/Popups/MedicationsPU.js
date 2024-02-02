import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import { patientIdToName } from "../../../../utils/patientIdToName";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import { default as MedicationItem } from "../Topics/Medications/MedicationItem";
import PrescriptionPU from "./PrescriptionPU";

const MedicationsPU = ({
  patientId,
  setPopUpVisible,
  demographicsInfos,
  datas,
  isLoading,
  errMsg,
}) => {
  //HOOKS
  const { clinic } = useAuth();
  const editCounter = useRef(0);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [presVisible, setPresVisible] = useState(false);

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
  const handleNewRX = (e) => {
    setErrMsgPost("");
    setPresVisible((v) => !v);
  };

  return (
    <>
      <h1 className="medications__title">
        Patient medications and treatments <i className="fa-solid fa-pills"></i>
      </h1>
      {errMsgPost && <div className="medications__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="medications__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <table className="medications__table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Drug name</th>
                  <th>Strength</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Created By</th>
                  <th>Created On</th>
                  <th style={{ textDecoration: "none", cursor: "default" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {datas.map((medication) => (
                  <MedicationItem
                    item={medication}
                    key={medication.id}
                    patientId={patientId}
                  />
                ))}
              </tbody>
            </table>
            <div className="medications__btn-container">
              <button onClick={handleNewRX}>New RX</button>
              <button onClick={handleClose}>Close</button>
            </div>
          </>
        )
      )}
      {presVisible && (
        <FakeWindow
          title={`NEW PRESCRIPTION to ${patientIdToName(
            clinic.demographicsInfos,
            patientId
          )}`}
          width={1400}
          height={750}
          x={(window.innerWidth - 1400) / 2}
          y={(window.innerHeight - 750) / 2}
          color="#931621"
          setPopUpVisible={setPresVisible}
        >
          <PrescriptionPU
            demographicsInfos={demographicsInfos}
            setPresVisible={setPresVisible}
            patientId={patientId}
            resize={false}
          />
        </FakeWindow>
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

export default MedicationsPU;
