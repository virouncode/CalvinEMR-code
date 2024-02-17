import React, { useRef, useState } from "react";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useFetchDatas from "../../../../hooks/useFetchDatas";
import useFetchTopicDatas from "../../../../hooks/useFetchTopicDatas";
import useTopicSocket from "../../../../hooks/useTopicSocket";
import { toPatientName } from "../../../../utils/toPatientName";
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
  const [pagingDoctors, setPagingDoctors] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const {
    topicDatas: doctors,
    setTopicDatas: setDoctors,
    loading: loadingDoctors,
    errMsg: errMsgDoctors,
    hasMore: hasMoreDoctors,
  } = useFetchTopicDatas("/doctors", pagingDoctors, patientId);

  useTopicSocket(topicDoctors, doctors, setDoctors, patientId);

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
            title={`FAMILY DOCTORS & SPECIALISTS of ${toPatientName(
              demographicsInfos
            )}`}
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
