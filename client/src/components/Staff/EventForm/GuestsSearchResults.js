import React from "react";
import { toLocalDate } from "../../../utils/formatDates";
import GuestPatientResultItem from "./GuestPatientResultItem";
import GuestStaffResultItem from "./GuestStaffResultItem";

const GuestsSearchResults = ({
  search,
  handleAddGuest,
  staffInfos,
  demographicsInfos,
  staffGuestsInfos,
  patientsGuestsInfos,
  hostId,
}) => {
  return (
    <ul className="results">
      {demographicsInfos
        .filter(
          (patient) =>
            (patient.Names.LegalName.FirstName.Part.toLowerCase().includes(
              search.name.toLowerCase()
            ) ||
              patient.Names.LegalName.LastName.Part.toLowerCase().includes(
                search.name.toLowerCase()
              ) ||
              patient.Names.LegalName.OtherName.Part.toLowerCase().includes(
                search.name.toLowerCase()
              )) &&
            patient.Email.toLowerCase().includes(search.email.toLowerCase()) &&
            patient.PhoneNumber.find(({ phoneNumber }) =>
              phoneNumber.includes(search.phone)
            ) &&
            toLocalDate(patient.DateOfBirth).includes(search.birth) &&
            patient.ChartNumber.includes(search.chart) &&
            patient.SIN.includes(search.health) &&
            !patientsGuestsInfos
              .map(({ patient_id }) => patient_id)
              .includes(patient.patient_id)
        )
        .map((guest) => (
          <GuestPatientResultItem
            key={guest.id}
            guest={guest}
            handleAddGuest={handleAddGuest}
          />
        ))}
      {search.chart === "" &&
        search.health === "" &&
        search.birth === "" &&
        staffInfos
          .filter(
            (staff) =>
              staff.full_name
                .toLowerCase()
                .includes(search.name.toLowerCase()) &&
              staff.email.toLowerCase().includes(search.email.toLowerCase()) &&
              (staff.cell_phone.includes(search.phone) ||
                staff.backup_phone.includes(search.phone)) &&
              !staffGuestsInfos.map(({ id }) => id).includes(staff.id) &&
              staff.id !== hostId
          )
          .map((guest) => (
            <GuestStaffResultItem
              key={guest.id}
              guest={guest}
              handleAddGuest={handleAddGuest}
            />
          ))}
    </ul>
  );
};

export default GuestsSearchResults;
