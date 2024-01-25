import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import AppointmentEvent from "../Topics/Appointments/AppointmentEvent";
import AppointmentForm from "../Topics/Appointments/AppointmentForm";

const AppointmentsPU = ({
  patientId,
  setPopUpVisible,
  demographicsInfos,
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

  const handleAdd = async (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  return (
    <>
      <h1 className="appointments__title">
        Patient appointments <i className="fa-regular fa-calendar-check"></i>
      </h1>
      {errMsgPost && <div className="appointments__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="appointments__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <table className="appointments__table">
              <thead>
                <tr>
                  <th>Host</th>
                  <th>Reason</th>
                  <th>From</th>
                  <th>To</th>
                  <th>All Day</th>
                  <th>Room</th>
                  <th>Status</th>
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
                  <AppointmentForm
                    patientId={patientId}
                    editCounter={editCounter}
                    demographicsInfos={demographicsInfos}
                    setAddVisible={setAddVisible}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                  />
                )}
                {datas.map((appointment) => (
                  <AppointmentEvent
                    event={appointment}
                    key={appointment.id}
                    editCounter={editCounter}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                  />
                ))}
              </tbody>
            </table>
            <div className="appointments__btn-container">
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

export default AppointmentsPU;
