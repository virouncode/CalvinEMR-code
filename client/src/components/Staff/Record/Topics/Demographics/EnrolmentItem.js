import React, { useState } from "react";
import { enrolmentCaptionComplete } from "../../../../../utils/enrolmentCaption";
import FakeWindow from "../../../../All/UI/Windows/FakeWindow";
import EnrolmentEdit from "./EnrolmentEdit";

const EnrolmentItem = ({
  enrolment,
  enrolmentIndex,
  demographicsInfos,
  enrolmentHistory,
}) => {
  const [editVisible, setEditVisible] = useState(false);

  const handleEdit = (e) => {
    setEditVisible(true);
  };
  return (
    <>
      <li className="enrolment-history__item" key={enrolment.EnrollmentDate}>
        - {enrolmentCaptionComplete(enrolment)}{" "}
        <i
          className="fa-regular fa-pen-to-square"
          style={{ marginLeft: "5px", cursor: "pointer" }}
          onClick={handleEdit}
        ></i>
      </li>
      {editVisible && (
        <FakeWindow
          title={`EDIT ENROLMENT`}
          width={500}
          height={400}
          x={(window.innerWidth - 500) / 2}
          y={(window.innerHeight - 400) / 2}
          color="#495867"
          setPopUpVisible={setEditVisible}
        >
          <EnrolmentEdit
            setEditVisible={setEditVisible}
            enrolment={enrolment}
            enrolmentIndex={enrolmentIndex}
            demographicsInfos={demographicsInfos}
            enrolmentHistory={enrolmentHistory}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default EnrolmentItem;
