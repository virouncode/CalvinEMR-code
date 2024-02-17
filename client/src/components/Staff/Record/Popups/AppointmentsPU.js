import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
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
  const { auth } = useAuthContext();
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchSites = async () => {
      try {
        const response = await axiosXanoStaff.get("/sites", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setSites(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        toast.error(`Error: unable to get clinic sites: ${err.message}`, {
          containerId: "B",
        });
      }
    };
    fetchSites();
    return () => abortController.abort();
  }, [auth.authToken]);

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
        <CircularProgressMedium />
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
                  <th>Site</th>
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
                    sites={sites}
                  />
                )}
                {datas.map((appointment) => (
                  <AppointmentEvent
                    event={appointment}
                    key={appointment.id}
                    editCounter={editCounter}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                    sites={sites}
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
