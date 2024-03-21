import React from "react";
import EmptyRow from "../../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../../All/UI/Tables/LoadingRow";
import PatientFamilyDoctorItem from "./PatientFamilyDoctorItem";

const PatientFamilyDoctorsList = ({
  rootRefPatientDoctors,
  lastItemRefPatientDoctors,
  patientDoctors,
  patientId,
  loadingPatientDoctors,
}) => {
  return (
    <>
      <p className="doctors__table-title">External Doctors</p>
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
                    <PatientFamilyDoctorItem
                      item={item}
                      patientId={patientId}
                      key={item.id}
                      lastItemRef={lastItemRefPatientDoctors}
                    />
                  ) : (
                    <PatientFamilyDoctorItem
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
    </>
  );
};

export default PatientFamilyDoctorsList;
