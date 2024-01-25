import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import AllergyForm from "../Topics/Allergies/AllergyForm";
import AllergyItem from "../Topics/Allergies/AllergyItem";

const AllergiesPU = ({
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
      <h1 className="allergies__title">
        Patient allergies & adverse reactions{" "}
        <i className="fa-solid fa-hand-dots"></i>
      </h1>
      {errMsgPost && <div className="allergies__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="allergies__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <table className="allergies__table">
              <thead>
                <tr>
                  <th>Offending agent</th>
                  <th>Type of agent</th>
                  <th>Reaction type</th>
                  <th>Start date</th>
                  <th>Life stage</th>
                  <th>Severity</th>
                  <th>Reaction</th>
                  <th>Recorded date</th>
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
                  <AllergyForm
                    editCounter={editCounter}
                    setAddVisible={setAddVisible}
                    patientId={patientId}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                )}
                {datas.map((allergy) => (
                  <AllergyItem
                    item={allergy}
                    key={allergy.id}
                    editCounter={editCounter}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                ))}
              </tbody>
            </table>
            <div className="allergies__btn-container">
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

export default AllergiesPU;
