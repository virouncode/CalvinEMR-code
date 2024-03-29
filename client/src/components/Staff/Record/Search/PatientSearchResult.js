import React from "react";
import useIntersection from "../../../../hooks/useIntersection";
import LoadingRow from "../../../UI/Tables/LoadingRow";
import PatientResultItem from "./PatientResultItem";

const PatientSearchResult = ({
  patientsDemographics,
  loading,
  hasMore,
  setPaging,
  totalPatients,
}) => {
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  return (
    <>
      <div className="patient-result__summary">
        Total number of patients: {totalPatients}
      </div>
      <div className="patient-result__table-container" ref={rootRef}>
        <table className="patient-result__table">
          <thead>
            <tr>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Date of birth</th>
              <th>Age</th>
              <th>Chart#</th>
              <th>Email</th>
              <th>Cell phone</th>
              <th>Home phone</th>
              <th>Work phone</th>
              <th>Health Card#</th>
              <th>Address</th>
              <th>Postal/Zip Code</th>
              <th>Province/State</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {patientsDemographics.map((patient, index) =>
              index === patientsDemographics.length - 1 ? (
                <PatientResultItem
                  patient={patient}
                  key={patient.id}
                  lastPatientRef={lastItemRef}
                />
              ) : (
                <PatientResultItem patient={patient} key={patient.id} />
              )
            )}
            {loading && <LoadingRow colSpan="15" />}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PatientSearchResult;
