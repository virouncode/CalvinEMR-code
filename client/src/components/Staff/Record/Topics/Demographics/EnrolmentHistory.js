import React from "react";
import EnrolmentItem from "./EnrolmentItem";

const EnrolmentHistory = ({ enrolmentHistory, demographicsInfos }) => {
  return (
    <div className="enrolment-history__container">
      {enrolmentHistory.length > 0 ? (
        <ul>
          {enrolmentHistory.map((enrolment, index) => (
            <EnrolmentItem
              enrolment={enrolment}
              enrolmentIndex={index}
              demographicsInfos={demographicsInfos}
              enrolmentHistory={enrolmentHistory}
              key={index + enrolment.EnrollmentDate}
            />
          ))}
        </ul>
      ) : (
        "No enrolments"
      )}
    </div>
  );
};

export default EnrolmentHistory;
