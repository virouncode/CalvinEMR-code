import React, { useRef, useState } from "react";
import useFetchDatas from "../../../../../hooks/useFetchDatas";
import useIntersection from "../../../../../hooks/useIntersection";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../../All/Confirm/ConfirmGlobal";
import ToastCalvin from "../../../../UI/Toast/ToastCalvin";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import ClinicDoctorsList from "./ClinicDoctorsList";
import FamilyDoctorsList from "./FamilyDoctorsList";
import PatientClinicDoctorsList from "./PatientClinicDoctorsList";
import PatientFamilyDoctorsList from "./PatientFamilyDoctorsList";

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
  const [sites] = useFetchDatas("/sites", "staff");

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
        Patient family doctors & specialists{" "}
        <i className="fa-solid fa-user-doctor"></i>
      </h1>
      {errMsgPatientDoctors && (
        <div className="doctors__err">{errMsgPatientDoctors}</div>
      )}
      {!errMsgPatientDoctors && (
        <>
          <PatientFamilyDoctorsList
            rootRefPatientDoctors={rootRefPatientDoctors}
            lastItemRefPatientDoctors={lastItemRefPatientDoctors}
            patientDoctors={patientDoctors}
            patientId={patientId}
            loadingPatientDoctors={loadingPatientDoctors}
          />
          <PatientClinicDoctorsList patientId={patientId} sites={sites} />
          <div className="doctors__btn-container">
            <button onClick={handleAdd} disabled={addVisible}>
              Add a family doctor/specialist to patient
            </button>
            <button onClick={handleClose}>Close</button>
          </div>
          {addVisible && (
            <FakeWindow
              title="ADD A NEW DOCTOR TO PATIENT"
              width={1400}
              height={600}
              x={(window.innerWidth - 1400) / 2}
              y={(window.innerHeight - 600) / 2}
              color="#21201E"
              setPopUpVisible={setAddVisible}
            >
              <FamilyDoctorsList
                patientId={patientId}
                editCounter={editCounter}
                doctors={doctors}
                loadingDoctors={loadingDoctors}
                errMsgDoctors={errMsgDoctors}
                hasMoreDoctors={hasMoreDoctors}
                setPagingDoctors={setPagingDoctors}
              />
              <ClinicDoctorsList patientId={patientId} sites={sites} />
            </FakeWindow>
          )}
        </>
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default FamilyDoctorsPU;
