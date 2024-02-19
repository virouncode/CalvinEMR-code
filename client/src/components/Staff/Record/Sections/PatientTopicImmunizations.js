import React, { useRef, useState } from "react";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useFetchDatas from "../../../../hooks/useFetchDatas";
import useTopicSocket from "../../../../hooks/useTopicSocket";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import ImmunizationsPU from "../Popups/ImmunizationsPU";
import ImmunizationsContent from "../Topics/Immunizations/ImmunizationsContent";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopicImmunizations = ({
  textColor,
  backgroundColor,
  patientName,
  patientDob,
  patientId,
  allContentsVisible,
  side,
  loadingPatient,
  errPatient,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef("null");

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //DATAS
  const [topicDatas, setTopicDatas, loading, errMsg] = useFetchDatas(
    "/immunizations_of_patient",
    axiosXanoStaff,
    auth.authToken,
    "patient_id",
    patientId
  );

  //SOCKET
  useTopicSocket("IMMUNIZATIONS", topicDatas, setTopicDatas, patientId);

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
          topic="IMMUNIZATIONS"
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
        <ImmunizationsContent
          topicDatas={topicDatas}
          loading={loading}
          errMsg={errMsg}
        />
        {popUpVisible && (
          <FakeWindow
            title={`IMMUNIZATIONS of ${patientName}`}
            width={1400}
            height={700}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 700) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ImmunizationsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              patientDob={patientDob}
              loadingPatient={loadingPatient}
              errPatient={errPatient}
            />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default PatientTopicImmunizations;
