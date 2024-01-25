import { CircularProgress } from "@mui/material";
import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import PatientResultItem from "./PatientResultItem";

const PatientSearchResult = ({ search, sortedPatientsInfos }) => {
  return sortedPatientsInfos ? (
    <div className="patient-result">
      <table>
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Date of birth</th>
            <th>Age</th>
            <th>Email</th>
            <th>Cell phone</th>
            <th>Home phone</th>
            <th>Work phone</th>
            <th>SIN</th>
            <th>Address</th>
            <th>Postal/Zip Code</th>
            <th>Province/State</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {sortedPatientsInfos
            .filter(
              (patient) =>
                (patient.Names.LegalName.FirstName.Part.toLowerCase().includes(
                  search.name.toLowerCase()
                ) ||
                  patient.Names.LegalName.OtherName[0].Part.toLowerCase().includes(
                    search.name.toLowerCase()
                  ) ||
                  patient.Names.LegalName.LastName.Part.toLowerCase().includes(
                    search.name.toLowerCase()
                  )) &&
                patient.Email.toLowerCase().includes(
                  search.email.toLowerCase()
                ) &&
                patient.PhoneNumber.find(({ phoneNumber }) =>
                  phoneNumber.toLowerCase().includes(search.phone.toLowerCase())
                ) &&
                toLocalDate(patient.DateOfBirth).includes(search.birth) &&
                patient.ChartNumber.includes(search.chart) &&
                patient.SIN.includes(search.health)
            )
            .map((patient) => (
              <PatientResultItem patient={patient} key={patient.id} />
            ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default PatientSearchResult;
