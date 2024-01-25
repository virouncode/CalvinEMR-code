import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import ProblemListForm from "../Topics/ProblemList/ProblemListForm";
import ProblemListItem from "../Topics/ProblemList/ProblemListItem";

const ProblemListPU = ({
  patientId,
  setPopUpVisible,
  datas,
  errMsg,
  isLoading,
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
      <h1 className="problemlist__title">
        Patient problem list{" "}
        <i className="fa-solid fa-triangle-exclamation"></i>
      </h1>
      {errMsgPost && <div className="problemlist__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="problemlist__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <table className="problemlist__table">
              <thead>
                <tr>
                  <th>Diagnosis Description</th>
                  <th>Problem Description</th>
                  <th>Status</th>
                  <th>Onset date</th>
                  <th>Life stage</th>
                  <th>Resolution date</th>
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
                  <ProblemListForm
                    editCounter={editCounter}
                    setAddVisible={setAddVisible}
                    patientId={patientId}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                )}
                {datas.map((allergy) => (
                  <ProblemListItem
                    item={allergy}
                    key={allergy.id}
                    editCounter={editCounter}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                ))}
              </tbody>
            </table>
            <div className="problemlist__btn-container">
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

export default ProblemListPU;
