import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import FamilyDoctorItem from "../Topics/FamilyDoctors/FamilyDoctorItem";
import FamilyDoctorsList from "../Topics/FamilyDoctors/FamilyDoctorsList";

const FamilyDoctorsPU = ({
  patientId,
  setPopUpVisible,
  datas,
  isLoading,
  errMsg,
  demographicsInfos,
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
          content: "Do you really want to close the window ?",
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

  const handleAddItemClick = () => {};

  return (
    <>
      <h1 className="doctors__title">
        Patient family doctors <i className="fa-solid fa-user-doctor"></i>
      </h1>
      {errMsgPost && <div className="doctors__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="doctors__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <table className="doctors__table">
              <thead>
                <tr>
                  <th>Last name</th>
                  <th>First name</th>
                  <th>Speciality</th>
                  <th>Licence#</th>
                  <th>OHIP#</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Province/State</th>
                  <th>Postal/Zip Code</th>
                  <th>Phone</th>
                  <th>Fax</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {datas
                  .filter((doctor) => doctor.patients.includes(patientId))
                  .map((item) => (
                    <FamilyDoctorItem
                      item={item}
                      patientId={patientId}
                      key={item.id}
                    />
                  ))}
              </tbody>
            </table>
            <div className="doctors__btn-container">
              <button onClick={handleAdd} disabled={addVisible}>
                Add a family doctor to patient
              </button>
              <button onClick={handleClose}>Close</button>
            </div>
            {addVisible && (
              <FamilyDoctorsList
                handleAddItemClick={handleAddItemClick}
                patientId={patientId}
                setErrMsgPost={setErrMsgPost}
                errMsgPost={errMsgPost}
                editCounter={editCounter}
                demographicsInfos={demographicsInfos}
                datas={datas}
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

export default FamilyDoctorsPU;
