import { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import ReminderForm from "../Topics/Reminders/ReminderForm";
import ReminderItem from "../Topics/Reminders/ReminderItem";

const RemindersPU = ({
  patientId,
  setPopUpVisible,
  datas,
  setDatas,
  isLoading,
  errMsg,
}) => {
  //HOOKS

  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState(false);

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
      <h1 className="reminders__title">
        Reminders <i className="fa-solid fa-bell"></i>
      </h1>
      {errMsgPost && <div className="reminders__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgressMedium />
      ) : errMsg ? (
        <p className="reminders__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <table className="reminders__table">
              <thead>
                <tr>
                  <th>Active</th>
                  <th>Reminder</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                  <th style={{ textDecoration: "none", cursor: "default" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {addVisible && (
                  <ReminderForm
                    editCounter={editCounter}
                    setAddVisible={setAddVisible}
                    patientId={patientId}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                )}
                {datas
                  .filter((reminder) => reminder.active)
                  .map((reminder) => (
                    <ReminderItem
                      item={reminder}
                      key={reminder.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                    />
                  ))}
                {datas
                  .filter((reminder) => !reminder.active)
                  .map((reminder) => (
                    <ReminderItem
                      item={reminder}
                      key={reminder.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                    />
                  ))}
              </tbody>
            </table>
            <div className="reminders__btn-container">
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

export default RemindersPU;
