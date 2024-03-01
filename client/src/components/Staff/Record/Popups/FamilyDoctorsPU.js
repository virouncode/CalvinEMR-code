import React, { useRef, useState } from "react";
import useIntersection from "../../../../hooks/useIntersection";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../All/UI/Tables/LoadingRow";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import FamilyDoctorItem from "../Topics/FamilyDoctors/FamilyDoctorItem";
import FamilyDoctorsList from "../Topics/FamilyDoctors/FamilyDoctorsList";

const FamilyDoctorsPU = ({
  doctors,
  loadingDoctors,
  errMsgDoctors,
  hasMoreDoctors,
  setPagingDoctors,
  patientDoctors,
  loadingPatientDoctors,
  errMsgPatientDoctors,
  hasMorePatientDoctors,
  setPagingPatientDoctors,
  patientId,
  setPopUpVisible,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);

  //INTERSECTION OBSERVER
  const {
    rootRef: rootRefPatientDoctors,
    lastItemRef: lastItemRefPatientDoctors,
  } = useIntersection(
    loadingPatientDoctors,
    hasMorePatientDoctors,
    setPagingPatientDoctors
  );

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
    setAddVisible((v) => !v);
  };

  return (
    <>
      <h1 className="doctors__title">
        Patient family doctors <i className="fa-solid fa-user-doctor"></i>
      </h1>
      {errMsgPatientDoctors && (
        <div className="doctors__err">{errMsgPatientDoctors}</div>
      )}
      {!errMsgPatientDoctors && (
        <>
          <div className="doctors__table-container" ref={rootRefPatientDoctors}>
            <table className="doctors__table">
              <thead>
                <tr>
                  <th>Action</th>
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
                </tr>
              </thead>
              <tbody>
                {patientDoctors && patientDoctors.length > 0
                  ? patientDoctors.map((item, index) =>
                      index === patientDoctors.length - 1 ? (
                        <FamilyDoctorItem
                          item={item}
                          patientId={patientId}
                          key={item.id}
                          lastItemRef={lastItemRefPatientDoctors}
                        />
                      ) : (
                        <FamilyDoctorItem
                          item={item}
                          patientId={patientId}
                          key={item.id}
                        />
                      )
                    )
                  : !loadingPatientDoctors && (
                      <EmptyRow colSpan="13" text="No family doctors" />
                    )}
                {loadingPatientDoctors && <LoadingRow colSpan="13" />}
              </tbody>
            </table>
          </div>
          <div className="doctors__btn-container">
            <button onClick={handleAdd} disabled={addVisible}>
              Add a family doctor to patient
            </button>
            <button onClick={handleClose}>Close</button>
          </div>
          {addVisible && (
            <FamilyDoctorsList
              patientId={patientId}
              editCounter={editCounter}
              doctors={doctors}
              loadingDoctors={loadingDoctors}
              errMsgDoctors={errMsgDoctors}
              hasMoreDoctors={hasMoreDoctors}
              setPagingDoctors={setPagingDoctors}
            />
          )}
        </>
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default FamilyDoctorsPU;
