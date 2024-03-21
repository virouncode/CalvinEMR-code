import React from "react";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import EmptyRow from "../../../../All/UI/Tables/EmptyRow";
import ClinicDoctorListItem from "./ClinicDoctorItem";

const ClinicDoctorsList = ({ patientId, sites }) => {
  const { staffInfos } = useStaffInfosContext();
  const doctors = staffInfos.filter(({ title }) => title === "Doctor");

  return (
    <>
      <div className="doctors-list__title">Clinic Doctors database</div>
      <div className="doctors-list__table-container">
        <table className="doctors-list__table">
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
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {sites.length > 0 && doctors && doctors.length > 0 ? (
              doctors.map((item) => (
                <ClinicDoctorListItem
                  item={item}
                  key={item.id}
                  patientId={patientId}
                  site={sites.find(({ id }) => id === item.site_id)}
                />
              ))
            ) : (
              <EmptyRow colSpan="15" text="Clinic Doctors database empty" />
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ClinicDoctorsList;
