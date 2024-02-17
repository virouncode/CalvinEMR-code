import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import PregnancyEvent from "../Topics/Pregnancies/PregnancyEvent";
import PregnancyForm from "../Topics/Pregnancies/PregnancyForm";

const PregnanciesPU = ({
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
      <h1 className="pregnancies__title">
        Patient pregnancies <i className="fa-solid fa-person-pregnant"></i>
      </h1>
      {errMsgPost && <div className="pregnancies__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgressMedium />
      ) : errMsg ? (
        <p className="pregnancies__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <table className="pregnancies__table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date Of Event</th>
                  <th>Premises</th>
                  <th style={{ textDecoration: "none", cursor: "default" }}>
                    Term
                  </th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                  <th style={{ textDecoration: "none", cursor: "default" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {addVisible && (
                  <PregnancyForm
                    editCounter={editCounter}
                    setAddVisible={setAddVisible}
                    patientId={patientId}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                )}
                {datas.map((pregnancy) => (
                  <PregnancyEvent
                    event={pregnancy}
                    key={pregnancy.id}
                    editCounter={editCounter}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                ))}
              </tbody>
            </table>
            <div className="pregnancies__btn-container">
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

export default PregnanciesPU;
