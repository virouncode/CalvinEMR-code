import React, { useRef, useState } from "react";
import useTopicSocket from "../../../../hooks/socket/useTopicSocket";
import useFetchCategoryDatas from "../../../../hooks/useFetchCategoryDatas";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import FamilyDoctorsPU from "../Popups/FamilyDoctorsPU";
import FamilyDoctorsContent from "../Topics/FamilyDoctors/FamilyDoctorsContent";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopicDoctors = ({
  textColor,
  backgroundColor,
  patientName,
  patientId,
  contentsVisible,
  side,
  doctors,
  setDoctors,
  loadingDoctors,
  setLoadingDoctors,
  errMsgDoctors,
  setErrMsgDoctors,
  hasMoreDoctors,
  setHasMoreDoctors,
  pagingDoctors,
  setPagingDoctors,
  patientDoctors,
  setPatientDoctors,
  loadingPatientDoctors,
  setLoadingPatientDoctors,
  errMsgPatientDoctors,
  setErrMsgPatientDoctors,
  hasMorePatientDoctors,
  setHasMorePatientDoctors,
  pagingPatientDoctors,
  setPagingPatientDoctors,
  demographicsInfos,
}) => {
  //TOPICS
  const topicDoctors = "FAMILY DOCTORS/SPECIALISTS";
  const topicPatientDoctors = "PATIENT DOCTORS";

  //HOOKS
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef(null);
  const triangleRef = useRef(null);

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //DATAS
  useFetchCategoryDatas(
    "/doctors",
    setDoctors,
    setLoadingDoctors,
    setErrMsgDoctors,
    pagingDoctors,
    setHasMoreDoctors,
    patientId
  );
  useTopicSocket(topicDoctors, doctors, setDoctors, patientId);

  useFetchCategoryDatas(
    "/doctors_of_patient",
    setPatientDoctors,
    setLoadingPatientDoctors,
    setErrMsgPatientDoctors,
    pagingPatientDoctors,
    setHasMorePatientDoctors,
    patientId
  );
  useTopicSocket(
    topicPatientDoctors,
    patientDoctors,
    setPatientDoctors,
    patientId
  );

  //HANDLERS
  const handlePopUpClick = (e) => {
    e.stopPropagation();
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  const handleClickHeader = () => {
    triangleRef.current.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
        onClick={handleClickHeader}
      >
        <PatientTopicHeader
          topic={topicDoctors}
          handleTriangleClick={handleTriangleClick}
          handlePopUpClick={handlePopUpClick}
          contentsVisible={contentsVisible}
          popUpButton="popUp"
          triangleRef={triangleRef}
        />
      </div>
      <div
        className={
          contentsVisible
            ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        <FamilyDoctorsContent
          patientDoctors={patientDoctors}
          loadingPatientDoctors={loadingPatientDoctors}
          errMsgPatientDoctors={errMsgPatientDoctors}
          patientId={patientId}
        />
        {popUpVisible && (
          <FakeWindow
            title={`FAMILY DOCTORS & SPECIALISTS of ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamilyDoctorsPU
              doctors={doctors}
              loadingDoctors={loadingDoctors}
              errMsgDoctors={errMsgDoctors}
              hasMoreDoctors={hasMoreDoctors}
              setPagingDoctors={setPagingDoctors}
              patientDoctors={patientDoctors}
              loadingPatientDoctors={loadingPatientDoctors}
              errMsgPatientDoctors={errMsgPatientDoctors}
              hasMorePatientDoctors={hasMorePatientDoctors}
              setPagingPatientDoctors={setPagingPatientDoctors}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default PatientTopicDoctors;
