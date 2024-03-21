import React from "react";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import EmptyRow from "../../../../All/UI/Tables/EmptyRow";
import PatientClinicDoctorItem from "./PatientClinicDoctorItem";

const PatientClinicDoctorsList = ({ patientId, sites }) => {
  const { staffInfos } = useStaffInfosContext();
  const patientDoctors = staffInfos.filter(
    (staff) => staff.title === "Doctor" && staff.patients.includes(patientId)
  );
  return (
    <>
      <p className="doctors__table-title">Clinic Doctors</p>
      <div className="doctors__table-container">
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
            {patientDoctors && patientDoctors.length > 0 ? (
              patientDoctors.map((item) => (
                <PatientClinicDoctorItem
                  item={item}
                  patientId={patientId}
                  key={item.id}
                  site={sites.find(({ id }) => id === item.site_id)}
                />
              ))
            ) : (
              <EmptyRow colSpan="13" text="No clinic doctors" />
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PatientClinicDoctorsList;
