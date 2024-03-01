import React, { useRef, useState } from "react";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useFetchCategoryDatas from "../../../../hooks/useFetchCategoryDatas";
import useFetchDatas from "../../../../hooks/useFetchDatas";
import useTopicSocket from "../../../../hooks/useTopicSocket";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import FamilyDoctorsPU from "../Popups/FamilyDoctorsPU";
import FamilyDoctorsContent from "../Topics/FamilyDoctors/FamilyDoctorsContent";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopicDoctors = ({
  textColor,
  backgroundColor,
  patientName,
  patientId,
  allContentsVisible,
  side,
  topicDatas,
  setTopicDatas,
  loading,
  setLoading,
  errMsg,
  setErrMsg,
  hasMore,
  setHasMore,
  paging,
  setPaging,
  demographicsInfos,
}) => {
  //TOPICS
  const topicDoctors = "FAMILY DOCTORS/SPECIALISTS";
  const topicPatientDoctors = "PATIENT DOCTORS";

  //HOOKS
  const { auth } = useAuthContext();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef("null");

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //DATAS
  useFetchCategoryDatas(
    "/doctors",
    setTopicDatas,
    setLoading,
    setErrMsg,
    paging,
    setHasMore,
    patientId
  );
  useTopicSocket(topicDoctors, topicDatas, setTopicDatas, patientId);

  const [
    patientDoctors,
    setPatientDoctors,
    loadingPatientDoctors,
    errMsgPatientDoctors,
  ] = useFetchDatas(
    "/doctors_of_patient",
    axiosXanoStaff,
    auth.authToken,
    "patient_id",
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
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.target.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
      >
        <PatientTopicHeader
          topic={topicDoctors}
          handleTriangleClick={handleTriangleClick}
          handlePopUpClick={handlePopUpClick}
          allContentsVisible={allContentsVisible}
          popUpButton={true}
        />
      </div>
      <div
        className={
          allContentsVisible
            ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        <FamilyDoctorsContent
          patientDoctors={patientDoctors}
          loadingPatientDoctors={loadingPatientDoctors}
          errMsgPatientDoctors={errMsgPatientDoctors}
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
              doctors={topicDatas}
              loadingDoctors={loading}
              errMsgDoctors={errMsg}
              hasMoreDoctors={hasMore}
              setPagingDoctors={setPaging}
              patientDoctors={patientDoctors}
              loadingPatientDoctors={loadingPatientDoctors}
              errMsgPatientDoctors={errMsgPatientDoctors}
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
