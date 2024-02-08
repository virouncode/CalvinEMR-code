import React from "react";
import useAuth from "../../../hooks/useAuth";
import { toLocalDate } from "../../../utils/formatDates";
import { patientIdToName } from "../../../utils/patientIdToName";
import PatientsListItem from "./PatientsListItem";

const PatientsList = ({ isPatientChecked, handleCheckPatient, search }) => {
  const { clinic } = useAuth();
  return (
    <ul>
      {clinic.demographicsInfos
        .filter(
          (patient) =>
            patient.Email.toLowerCase().includes(search.toLowerCase()) ||
            patient.ChartNumber.includes(search) ||
            patientIdToName(clinic.demographicsInfos, patient.patient_id)
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            toLocalDate(patient.DateOfBirth).includes(search) ||
            patient.Address[0].Structured.Line1.toLowerCase().includes(
              search.toLowerCase()
            ) ||
            patient.Address[0].Structured.PostalZipCode.PostalCode?.toLowerCase().includes(
              search.toLowerCase()
            ) ||
            patient.Address[0].Structured.PostalZipCode.ZipCode?.toLowerCase().includes(
              search.toLowerCase()
            ) ||
            patient.Address[0].Structured.City.toLowerCase().includes(
              search.toLowerCase()
            ) ||
            patient.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber.includes(search) ||
            patient.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "W"
            )?.phoneNumber.includes(search) ||
            patient.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "R"
            )?.phoneNumber.includes(search) ||
            patient.HealthCard?.Number.includes(search)
        )
        .map((info) => (
          <PatientsListItem
            info={info}
            key={info.id}
            handleCheckPatient={handleCheckPatient}
            isPatientChecked={isPatientChecked}
            patientName={patientIdToName(
              clinic.demographicsInfos,
              info.patient_id
            )}
          />
        ))}
    </ul>
  );
};

export default PatientsList;
