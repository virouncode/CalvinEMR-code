import React from "react";
import useAuth from "../../../hooks/useAuth";
import { toLocalDate } from "../../../utils/formatDates";
import { patientIdToName } from "../../../utils/patientIdToName";
import PatientsListItem from "../../Staff/Messaging/PatientsListItem";

const MigrationPatientsList = ({
  isPatientIdChecked,
  isAllPatientsIdsChecked,
  handleCheckPatientId,
  handleCheckAllPatientsIds,
  search,
  isLoading,
}) => {
  const { clinic } = useAuth();
  return (
    <ul className="migration-export__patients-list">
      <li className="patients__list-item">
        <input
          type="checkbox"
          onChange={handleCheckAllPatientsIds}
          checked={isAllPatientsIdsChecked()}
          disabled={isLoading}
        />
        <label>All</label>
      </li>
      {clinic.demographicsInfos
        .filter(
          (patient) =>
            patient.Email.toLowerCase().includes(search.email.toLowerCase()) &&
            patient.ChartNumber.includes(search.chart) &&
            patientIdToName(clinic.demographicsInfos, patient.patient_id)
              .toLowerCase()
              .includes(search.name.toLowerCase()) &&
            toLocalDate(patient.DateOfBirth).includes(search.birth) &&
            (patient.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber.includes(search.phone) ||
              patient.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "W"
              )?.phoneNumber.includes(search.phone) ||
              patient.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "R"
              )?.phoneNumber.includes(search.phone)) &&
            patient.SIN.includes(search.sin)
        )
        .map((info) => (
          <PatientsListItem
            info={info}
            key={info.id}
            handleCheckPatient={handleCheckPatientId}
            isPatientChecked={isPatientIdChecked}
            patientName={patientIdToName(
              clinic.demographicsInfos,
              info.patient_id
            )}
            isLoading={isLoading}
          />
        ))}
    </ul>
  );
};

export default MigrationPatientsList;
