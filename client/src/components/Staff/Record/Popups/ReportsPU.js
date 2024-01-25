import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import ReportForm from "../Topics/Reports/ReportForm";
import ReportItem from "../Topics/Reports/ReportItem";

const ReportsPU = ({
  patientId,
  demographicsInfos,
  showDocument,
  setPopUpVisible,
  datas,
  setDatas,
  isLoading,
  errMsg,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //HANDLERS
  const handleAdd = (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

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

  return (
    <>
      <h1 className="reports__title">
        Patient reports <i className="fa-regular fa-folder"></i>
      </h1>

      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="reports__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <h1 className="reports__title">
              Patient reports <i className="fa-regular fa-folder"></i>
            </h1>
            <table className="reports__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Format</th>
                  <th>File extension and version</th>
                  <th>Content</th>
                  <th>Class</th>
                  <th>Subclass</th>
                  <th>Date of document</th>
                  <th>Date received</th>
                  <th>Author</th>
                  <th>Reviewed by</th>
                  <th>Date reviewed</th>
                  <th>Notes</th>
                  <th>Updated by</th>
                  <th>Updated on</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {datas.map((document) => (
                  <ReportItem
                    item={document}
                    key={document.id}
                    showDocument={showDocument}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                    demographicsInfos={demographicsInfos}
                  />
                ))}
              </tbody>
            </table>
            <div className="reports__btn-container">
              <button disabled={addVisible} onClick={handleAdd}>
                Add
              </button>
              <button onClick={handleClose}>Close</button>
            </div>
            {addVisible && (
              <ReportForm
                patientId={patientId}
                setAddVisible={setAddVisible}
                editCounter={editCounter}
                setErrMsgPost={setErrMsgPost}
                demographicsInfos={demographicsInfos}
                errMsgPost={errMsgPost}
              />
            )}
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

export default ReportsPU;
