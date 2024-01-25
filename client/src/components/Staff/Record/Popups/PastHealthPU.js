import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import PastHealthEvent from "../Topics/PastHealth/PastHealthEvent";
import PastHealthForm from "../Topics/PastHealth/PastHealthForm";

const PastHealthPU = ({
  patientId,
  setPopUpVisible,
  datas,
  isLoading,
  errMsg,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

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
  const handleAdd = (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  return (
    <>
      <h1 className="pasthealth__title">
        Patient past health <i className="fa-solid fa-laptop-medical"></i>
      </h1>
      {errMsgPost && <div className="pasthealth__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="pasthealth__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <table className="pasthealth__table">
              <thead>
                <tr>
                  <th>Description/Procedure</th>
                  <th>Onset date</th>
                  <th>Life Stage</th>
                  <th>Procedure date</th>
                  <th>Resolved date</th>
                  <th>Problem status</th>
                  <th>Notes</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                  <th style={{ textDecoration: "none", cursor: "default" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {addVisible && (
                  <PastHealthForm
                    editCounter={editCounter}
                    setAddVisible={setAddVisible}
                    patientId={patientId}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                )}
                {datas.map((event) => (
                  <PastHealthEvent
                    event={event}
                    key={event.id}
                    editCounter={editCounter}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                ))}
              </tbody>
            </table>
            <div className="pasthealth__btn-container">
              <button onClick={handleAdd} disabled={addVisible}>
                Add
              </button>
              <button onClick={handleClose}>Close</button>
            </div>
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

export default PastHealthPU;
