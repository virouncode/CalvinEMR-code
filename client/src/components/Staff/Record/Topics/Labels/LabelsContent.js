import React, { useState } from "react";
import NewWindow from "react-new-window";
import ClinicSiteLabel from "./ClinicSiteLabel";
import MdLabel from "./MdLabel";
import PatientLabel from "./PatientLabel";

const LabelsContent = ({ demographicsInfos }) => {
  const [labelVisible, setLabelVisible] = useState(false);
  const [choosenLabel, setChoosenLabel] = useState("");

  const handleClickPatientLabel = () => {
    setChoosenLabel("patient");
    setLabelVisible((v) => !v);
  };
  const handleClickMdLabel = () => {
    setChoosenLabel("MD");
    setLabelVisible((v) => !v);
  };
  const handleClickClinicLabel = () => {
    setChoosenLabel("clinic");
    setLabelVisible((v) => !v);
  };

  return (
    <>
      <div className="topic-content">
        <ul>
          <li
            className="labels-content__item"
            onClick={handleClickPatientLabel}
          >
            - Patient label
          </li>
          <li className="labels-content__item" onClick={handleClickMdLabel}>
            - MD label
          </li>
          <li className="labels-content__item" onClick={handleClickClinicLabel}>
            - Clinic site label
          </li>
        </ul>
      </div>
      {labelVisible && (
        <NewWindow
          title={`Print ${choosenLabel} label`}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 800,
            height: 300,
            left: 320,
            top: 200,
          }}
          onUnload={() => setLabelVisible(false)}
        >
          {choosenLabel === "patient" && (
            <PatientLabel demographicsInfos={demographicsInfos} />
          )}
          {choosenLabel === "MD" && (
            <MdLabel demographicsInfos={demographicsInfos} />
          )}
          {choosenLabel === "clinic" && (
            <ClinicSiteLabel demographicsInfos={demographicsInfos} />
          )}
        </NewWindow>
      )}
    </>
  );
};

export default LabelsContent;
